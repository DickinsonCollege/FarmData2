"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** The git errors which can be parsed from failed git commands. */
var GitError;
(function (GitError) {
    GitError[GitError["SSHKeyAuditUnverified"] = 0] = "SSHKeyAuditUnverified";
    GitError[GitError["SSHAuthenticationFailed"] = 1] = "SSHAuthenticationFailed";
    GitError[GitError["SSHPermissionDenied"] = 2] = "SSHPermissionDenied";
    GitError[GitError["HTTPSAuthenticationFailed"] = 3] = "HTTPSAuthenticationFailed";
    GitError[GitError["RemoteDisconnection"] = 4] = "RemoteDisconnection";
    GitError[GitError["HostDown"] = 5] = "HostDown";
    GitError[GitError["RebaseConflicts"] = 6] = "RebaseConflicts";
    GitError[GitError["MergeConflicts"] = 7] = "MergeConflicts";
    GitError[GitError["HTTPSRepositoryNotFound"] = 8] = "HTTPSRepositoryNotFound";
    GitError[GitError["SSHRepositoryNotFound"] = 9] = "SSHRepositoryNotFound";
    GitError[GitError["PushNotFastForward"] = 10] = "PushNotFastForward";
    GitError[GitError["BranchDeletionFailed"] = 11] = "BranchDeletionFailed";
    GitError[GitError["DefaultBranchDeletionFailed"] = 12] = "DefaultBranchDeletionFailed";
    GitError[GitError["RevertConflicts"] = 13] = "RevertConflicts";
    GitError[GitError["EmptyRebasePatch"] = 14] = "EmptyRebasePatch";
    GitError[GitError["NoMatchingRemoteBranch"] = 15] = "NoMatchingRemoteBranch";
    GitError[GitError["NothingToCommit"] = 16] = "NothingToCommit";
    GitError[GitError["NoSubmoduleMapping"] = 17] = "NoSubmoduleMapping";
    GitError[GitError["SubmoduleRepositoryDoesNotExist"] = 18] = "SubmoduleRepositoryDoesNotExist";
    GitError[GitError["InvalidSubmoduleSHA"] = 19] = "InvalidSubmoduleSHA";
    GitError[GitError["LocalPermissionDenied"] = 20] = "LocalPermissionDenied";
    GitError[GitError["InvalidMerge"] = 21] = "InvalidMerge";
    GitError[GitError["InvalidRebase"] = 22] = "InvalidRebase";
    GitError[GitError["NonFastForwardMergeIntoEmptyHead"] = 23] = "NonFastForwardMergeIntoEmptyHead";
    GitError[GitError["PatchDoesNotApply"] = 24] = "PatchDoesNotApply";
    GitError[GitError["BranchAlreadyExists"] = 25] = "BranchAlreadyExists";
    GitError[GitError["BadRevision"] = 26] = "BadRevision";
    GitError[GitError["NotAGitRepository"] = 27] = "NotAGitRepository";
    GitError[GitError["CannotMergeUnrelatedHistories"] = 28] = "CannotMergeUnrelatedHistories";
    GitError[GitError["LFSAttributeDoesNotMatch"] = 29] = "LFSAttributeDoesNotMatch";
    GitError[GitError["BranchRenameFailed"] = 30] = "BranchRenameFailed";
    GitError[GitError["PathDoesNotExist"] = 31] = "PathDoesNotExist";
    GitError[GitError["InvalidObjectName"] = 32] = "InvalidObjectName";
    GitError[GitError["OutsideRepository"] = 33] = "OutsideRepository";
    GitError[GitError["LockFileAlreadyExists"] = 34] = "LockFileAlreadyExists";
    // GitHub-specific error codes
    GitError[GitError["PushWithFileSizeExceedingLimit"] = 35] = "PushWithFileSizeExceedingLimit";
    GitError[GitError["HexBranchNameRejected"] = 36] = "HexBranchNameRejected";
    GitError[GitError["ForcePushRejected"] = 37] = "ForcePushRejected";
    GitError[GitError["InvalidRefLength"] = 38] = "InvalidRefLength";
    GitError[GitError["ProtectedBranchRequiresReview"] = 39] = "ProtectedBranchRequiresReview";
    GitError[GitError["ProtectedBranchForcePush"] = 40] = "ProtectedBranchForcePush";
    GitError[GitError["ProtectedBranchDeleteRejected"] = 41] = "ProtectedBranchDeleteRejected";
    GitError[GitError["ProtectedBranchRequiredStatus"] = 42] = "ProtectedBranchRequiredStatus";
    GitError[GitError["PushWithPrivateEmail"] = 43] = "PushWithPrivateEmail";
})(GitError = exports.GitError || (exports.GitError = {}));
/** A mapping from regexes to the git error they identify. */
exports.GitErrorRegexes = {
    'ERROR: ([\\s\\S]+?)\\n+\\[EPOLICYKEYAGE\\]\\n+fatal: Could not read from remote repository.': GitError.SSHKeyAuditUnverified,
    "fatal: Authentication failed for 'https://": GitError.HTTPSAuthenticationFailed,
    'fatal: Authentication failed': GitError.SSHAuthenticationFailed,
    'fatal: Could not read from remote repository.': GitError.SSHPermissionDenied,
    'The requested URL returned error: 403': GitError.HTTPSAuthenticationFailed,
    'fatal: The remote end hung up unexpectedly': GitError.RemoteDisconnection,
    "fatal: unable to access '(.+)': Failed to connect to (.+): Host is down": GitError.HostDown,
    'Failed to merge in the changes.': GitError.RebaseConflicts,
    '(Merge conflict|Automatic merge failed; fix conflicts and then commit the result)': GitError.MergeConflicts,
    "fatal: repository '(.+)' not found": GitError.HTTPSRepositoryNotFound,
    'ERROR: Repository not found': GitError.SSHRepositoryNotFound,
    "\\((non-fast-forward|fetch first)\\)\nerror: failed to push some refs to '.*'": GitError.PushNotFastForward,
    "error: unable to delete '(.+)': remote ref does not exist": GitError.BranchDeletionFailed,
    '\\[remote rejected\\] (.+) \\(deletion of the current branch prohibited\\)': GitError.DefaultBranchDeletionFailed,
    "error: could not revert .*\nhint: after resolving the conflicts, mark the corrected paths\nhint: with 'git add <paths>' or 'git rm <paths>'\nhint: and commit the result with 'git commit'": GitError.RevertConflicts,
    "Applying: .*\nNo changes - did you forget to use 'git add'\\?\nIf there is nothing left to stage, chances are that something else\n.*": GitError.EmptyRebasePatch,
    'There are no candidates for (rebasing|merging) among the refs that you just fetched.\nGenerally this means that you provided a wildcard refspec which had no\nmatches on the remote end.': GitError.NoMatchingRemoteBranch,
    'nothing to commit': GitError.NothingToCommit,
    "No submodule mapping found in .gitmodules for path '(.+)'": GitError.NoSubmoduleMapping,
    "fatal: repository '(.+)' does not exist\nfatal: clone of '.+' into submodule path '(.+)' failed": GitError.SubmoduleRepositoryDoesNotExist,
    "Fetched in submodule path '(.+)', but it did not contain (.+). Direct fetching of that commit failed.": GitError.InvalidSubmoduleSHA,
    "fatal: could not create work tree dir '(.+)'.*: Permission denied": GitError.LocalPermissionDenied,
    'merge: (.+) - not something we can merge': GitError.InvalidMerge,
    'invalid upstream (.+)': GitError.InvalidRebase,
    'fatal: Non-fast-forward commit does not make sense into an empty head': GitError.NonFastForwardMergeIntoEmptyHead,
    'error: (.+): (patch does not apply|already exists in working directory)': GitError.PatchDoesNotApply,
    "fatal: A branch named '(.+)' already exists.": GitError.BranchAlreadyExists,
    "fatal: bad revision '(.*)'": GitError.BadRevision,
    'fatal: [Nn]ot a git repository \\(or any of the parent directories\\): (.*)': GitError.NotAGitRepository,
    'fatal: refusing to merge unrelated histories': GitError.CannotMergeUnrelatedHistories,
    'The .+ attribute should be .+ but is .+': GitError.LFSAttributeDoesNotMatch,
    'fatal: Branch rename failed': GitError.BranchRenameFailed,
    "fatal: Path '(.+)' does not exist .+": GitError.PathDoesNotExist,
    "fatal: Invalid object name '(.+)'.": GitError.InvalidObjectName,
    "fatal: .+: '(.+)' is outside repository": GitError.OutsideRepository,
    'Another git process seems to be running in this repository, e.g.': GitError.LockFileAlreadyExists,
    // GitHub-specific errors
    'error: GH001: ': GitError.PushWithFileSizeExceedingLimit,
    'error: GH002: ': GitError.HexBranchNameRejected,
    'error: GH003: Sorry, force-pushing to (.+) is not allowed.': GitError.ForcePushRejected,
    'error: GH005: Sorry, refs longer than (.+) bytes are not allowed': GitError.InvalidRefLength,
    'error: GH006: Protected branch update failed for (.+)\nremote: error: At least one approved review is required': GitError.ProtectedBranchRequiresReview,
    'error: GH006: Protected branch update failed for (.+)\nremote: error: Cannot force-push to a protected branch': GitError.ProtectedBranchForcePush,
    'error: GH006: Protected branch update failed for (.+)\nremote: error: Cannot delete a protected branch': GitError.ProtectedBranchDeleteRejected,
    'error: GH006: Protected branch update failed for (.+).\nremote: error: Required status check "(.+)" is expected': GitError.ProtectedBranchRequiredStatus,
    'error: GH007: Your push would publish a private email address.': GitError.PushWithPrivateEmail
};
/**
 * The error code for when git cannot be found. This most likely indicates a
 * problem with dugite itself.
 */
exports.GitNotFoundErrorCode = 'git-not-found-error';
/** The error code for when the path to a repository doesn't exist. */
exports.RepositoryDoesNotExistErrorCode = 'repository-does-not-exist-error';
//# sourceMappingURL=errors.js.map