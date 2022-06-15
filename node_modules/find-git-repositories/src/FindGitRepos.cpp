#include "../includes/FindGitRepos.h"

NAN_METHOD(FindGitRepos)
{
  if (info.Length() < 1 || !info[0]->IsString())
    return ThrowError("Must provide starting path as first argument.");

  if (info.Length() < 2 || !info[1]->IsUint32())
    return ThrowError("Must provide throttle timeout as second argument.");

  if (info.Length() < 3 || !info[2]->IsFunction())
    return ThrowError("Must provide progress callback as third argument.");

  if (info.Length() < 4 || !info[3]->IsFunction())
    return ThrowError("Must provide completion callback as fourth argument.");

  Nan::Utf8String utf8Path(Nan::To<v8::String>(info[0]).ToLocalChecked());
  std::string path = std::string(*utf8Path);

  Callback *progressCallback = new Callback(info[2].As<v8::Function>()),
           *completionCallback = new Callback(info[3].As<v8::Function>());

  AsyncQueueWorker(new FindGitReposWorker(path, Nan::To<uint32_t>(info[1]).FromJust(), progressCallback, completionCallback));
}

FindGitReposWorker::FindGitReposWorker(std::string path, uint32_t throttleTimeoutMS, Callback *progressCallback, Callback *completionCallback):
  AsyncWorker(completionCallback), mPath(path), mThrottleTimeoutMS(throttleTimeoutMS)
{
  mLastScheduledCallback = uv_hrtime() / 1000000;
  mProgressAsyncHandle = new uv_async_t;

  uv_async_init(uv_default_loop(), mProgressAsyncHandle, &FindGitReposWorker::FireProgressCallback);

  mBaton = new FindGitReposProgressBaton;
  mBaton->progressCallback = progressCallback;
  mProgressAsyncHandle->data = reinterpret_cast<void *>(mBaton);
}

#if defined(_WIN32)
static void stripNTPrefix(std::wstring &path) {
  if (path.rfind(L"\\\\?\\UNC\\", 0) != std::wstring::npos) {
    path.replace(0, 7, L"\\");
  } else if (path.rfind(L"\\\\?\\", 0) != std::wstring::npos) {
    path.erase(0, 4);
  }
}

static int convertWideCharToMultiByte(std::string *out, std::wstring input, bool wasNtPath) {
  std::wstring _input = input;
  if (!wasNtPath) {
    stripNTPrefix(_input);
  }

  int utf8Length = WideCharToMultiByte(
    CP_UTF8,
    0,
    _input.c_str(),
    -1,
    0,
    0,
    NULL,
    NULL
  );
  out->resize(utf8Length - 1);
  return WideCharToMultiByte(
    CP_UTF8,
    0,
    _input.c_str(),
    -1,
    &(*out)[0],
    utf8Length,
    NULL,
    NULL
  );
}

static bool isNtPath(const std::wstring &path) {
  return path.rfind(L"\\\\?\\", 0) == 0 || path.rfind(L"\\??\\", 0) == 0;
}

static std::wstring prefixWithNtPath(const std::wstring &path) {
  const ULONG widePathLength = GetFullPathNameW(path.c_str(), 0, nullptr, nullptr);
  if (widePathLength == 0) {
    return path;
  }

  std::wstring ntPathString;
  ntPathString.resize(widePathLength - 1);
  if (GetFullPathNameW(path.c_str(), widePathLength, &(ntPathString[0]), nullptr) != widePathLength - 1) {
    return path;
  }

  return ntPathString.rfind(L"\\\\", 0) == 0
    ? ntPathString.replace(0, 2, L"\\\\?\\UNC\\")
    : ntPathString.replace(0, 0, L"\\\\?\\");
}

static std::wstring convertMultiByteToWideChar(const std::string &multiByte) {
  const int wlen = MultiByteToWideChar(CP_UTF8, 0, multiByte.data(), -1, 0, 0);

  if (wlen == 0) {
    return std::wstring();
  }

  std::wstring wideString;
  wideString.resize(wlen - 1);

  int failureToResolveUTF8 = MultiByteToWideChar(CP_UTF8, 0, multiByte.data(), -1, &(wideString[0]), wlen);
  if (failureToResolveUTF8 == 0) {
    return std::wstring();
  }

  return wideString;
}

void FindGitReposWorker::Execute() {
  const std::wstring gitPath = L".git";
  const std::wstring backslash = L"\\";
  const std::wstring dot = L".";
  const std::wstring dotdot = L"..";
  std::list<std::wstring> foundPaths;
  auto rootPath = convertMultiByteToWideChar(mPath);
  const bool wasNtPath = isNtPath(rootPath);

  if (!wasNtPath) {
    rootPath = prefixWithNtPath(rootPath);
  }

  foundPaths.push_back(rootPath);

  while (foundPaths.size()) {
    WIN32_FIND_DATAW FindFileData;
    HANDLE hFind = INVALID_HANDLE_VALUE;
    std::wstring currentPath = foundPaths.front();
    foundPaths.pop_front();

    std::wstring wildcardPath = currentPath + L"\\*";
    hFind = FindFirstFileW(wildcardPath.c_str(), &FindFileData);
    if (hFind == INVALID_HANDLE_VALUE) {
      continue;
    }

    std::list<std::wstring> tempPaths;
    if (
      (FindFileData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) == FILE_ATTRIBUTE_DIRECTORY
      && dot != FindFileData.cFileName
      && dotdot != FindFileData.cFileName
    ) {
      if (gitPath == FindFileData.cFileName) {
        std::string repoPath;
        int success = convertWideCharToMultiByte(&repoPath, currentPath, wasNtPath);
        if (!success) {
          FindClose(hFind);
          continue;
        }

        repoPath += "\\.git";

        mBaton->progressQueue.enqueue(repoPath);
        mRepositories.push_back(repoPath);
        ThrottledProgressCallback();
        FindClose(hFind);
        continue;
      }

      tempPaths.push_back(currentPath + backslash + std::wstring(FindFileData.cFileName));
    }

    bool isGitRepo = false;
    while (FindNextFileW(hFind, &FindFileData)) {
      if (dot == FindFileData.cFileName || dotdot == FindFileData.cFileName) {
        continue;
      }

      if ((FindFileData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) != FILE_ATTRIBUTE_DIRECTORY) {
        continue;
      }

      if (gitPath == FindFileData.cFileName) {
        std::string repoPath;
        int success = convertWideCharToMultiByte(&repoPath, currentPath, wasNtPath);
        isGitRepo = true;
        if (!success) {
          break;
        }

        repoPath += "\\.git";

        mBaton->progressQueue.enqueue(repoPath);
        mRepositories.push_back(repoPath);
        ThrottledProgressCallback();
        break;
      }

      tempPaths.push_back(currentPath + backslash + std::wstring(FindFileData.cFileName));
    }

    if (!isGitRepo) {
      foundPaths.splice(foundPaths.end(), tempPaths);
    }

    FindClose(hFind);
  }
}
#else
void FindGitReposWorker::Execute() {
  uv_dirent_t directoryEntry;
  uv_fs_t scandirRequest;
  std::list<std::string> foundPaths;
  foundPaths.push_back(mPath);

  while (foundPaths.size()) {
    std::list<std::string> temp;
    bool isGitRepo = false;
    std::string currentPath = foundPaths.front();
    foundPaths.pop_front();

    if (uv_fs_scandir(NULL, &scandirRequest, (currentPath + '/').c_str(), 0, NULL) < 0) {
      continue;
    }

    while (uv_fs_scandir_next(&scandirRequest, &directoryEntry) != UV_EOF) {
      std::string nextPath = currentPath + '/' + directoryEntry.name;

      if (directoryEntry.type == UV_DIRENT_UNKNOWN) {
        uv_fs_t lstatRequest;
        if (
          uv_fs_lstat(NULL, &lstatRequest, nextPath.c_str(), NULL) < 0
          || !S_ISDIR(lstatRequest.statbuf.st_mode)
          || S_ISLNK(lstatRequest.statbuf.st_mode)
        ) {
          continue;
        }
      } else if (directoryEntry.type != UV_DIRENT_DIR) {
        continue;
      }

      if (strcmp(directoryEntry.name, ".git")) {
        temp.push_back(nextPath);
        continue;
      }

      isGitRepo = true;
      mBaton->progressQueue.enqueue(nextPath);
      mRepositories.push_back(nextPath);
      ThrottledProgressCallback();
    }

    if (!isGitRepo) {
      foundPaths.splice(foundPaths.end(), temp);
    }
  }
}
#endif

void FindGitReposWorker::FireProgressCallback(uv_async_t *progressAsyncHandle) {
  Nan::HandleScope scope;
  FindGitReposProgressBaton *baton = reinterpret_cast<FindGitReposProgressBaton *>(progressAsyncHandle->data);

  int numRepos = baton->progressQueue.count();

  v8::Local<v8::Array> repositoryArray = Nan::New<v8::Array>(numRepos);

  for (unsigned int i = 0; i < (unsigned int)numRepos; ++i) {
    Nan::Set(repositoryArray, i, Nan::New<v8::String>(baton->progressQueue.dequeue()).ToLocalChecked());
  }

  v8::Local<v8::Value> argv[] = { repositoryArray };

  baton->progressCallback->Call(1, argv);
}

void FindGitReposWorker::CleanUpProgressBatonAndHandle(uv_handle_t *progressAsyncHandle) {
  // Libuv is done with this handle in this callback
  FindGitReposProgressBaton *baton = reinterpret_cast<FindGitReposProgressBaton *>(progressAsyncHandle->data);
  baton->progressQueue.clear();
  delete baton->progressCallback;
  delete baton;
  delete reinterpret_cast<uv_async_t *>(progressAsyncHandle);
}

void FindGitReposWorker::HandleOKCallback() {
  uv_close(reinterpret_cast<uv_handle_t*>(mProgressAsyncHandle), &FindGitReposWorker::CleanUpProgressBatonAndHandle);

  // dump vector of repositories into js callback
  v8::Local<v8::Array> repositoryArray = Nan::New<v8::Array>((int)mRepositories.size());

  for (unsigned int i = 0; i < mRepositories.size(); ++i) {
    Nan::Set(repositoryArray, i, Nan::New<v8::String>(mRepositories[i]).ToLocalChecked());
  }

  v8::Local<v8::Value> argv[] = { repositoryArray };

  callback->Call(1, argv);
}

void FindGitReposWorker::ThrottledProgressCallback() {
  if (mThrottleTimeoutMS == 0) {
    uv_async_send(mProgressAsyncHandle);
    return;
  }

  uint32_t now = uv_hrtime() / 1000000;
  if ((now - mLastScheduledCallback) < mThrottleTimeoutMS) {
    return;
  }

  uv_async_send(mProgressAsyncHandle);

  mLastScheduledCallback = now;
}

NAN_MODULE_INIT(Init)
{
  Nan::Set(
    target,
    Nan::New("findGitRepos").ToLocalChecked(),
    Nan::GetFunction(Nan::New<v8::FunctionTemplate>(FindGitRepos)).ToLocalChecked()
  );
}

NODE_MODULE(findGitRepos, Init)
