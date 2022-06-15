"use strict";
/*
 * Copyright (c) 2017 TypeFox. Licensed under the MIT License.
 * See the LICENSE file in the project root for license information.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// The current implementation is based on https://github.com/microsoft/vscode/blob/master/extensions/git/src/git.ts#L50-L141
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var path = require("path");
var which = require("which");
var cp = require("child_process");
/**
 * Resolves to the path of the locally available Git executable. Will be rejected if Git cannot be found on the system.
 * `hint` can be provided as the initial lookup path, and `onLookup` function is used for logging during the Git discovery.
 */
function default_1(_a) {
    var _b = _a === void 0 ? {} : _a, hint = _b.hint, onLookup = _b.onLookup;
    return __awaiter(this, void 0, void 0, function () {
        var lookup, first;
        var _this = this;
        return __generator(this, function (_c) {
            lookup = onLookup !== null && onLookup !== void 0 ? onLookup : (function () { });
            first = hint ? findSpecificGit(hint, lookup) : Promise.reject(null);
            return [2 /*return*/, first
                    .then(undefined, function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, gitOnPath;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = process.platform;
                                switch (_a) {
                                    case 'darwin': return [3 /*break*/, 1];
                                    case 'win32': return [3 /*break*/, 2];
                                }
                                return [3 /*break*/, 3];
                            case 1: return [2 /*return*/, findGitDarwin(lookup)];
                            case 2: return [2 /*return*/, findGitWin32(lookup)];
                            case 3: return [4 /*yield*/, which('git')];
                            case 4:
                                gitOnPath = _b.sent();
                                return [4 /*yield*/, findSpecificGit(gitOnPath, lookup)];
                            case 5: return [2 /*return*/, _b.sent()];
                        }
                    });
                }); })
                    .then(null, function () { return Promise.reject(new Error('Git installation not found.')); })];
        });
    });
}
exports.default = default_1;
function toUtf8String(buffers) {
    return Buffer.concat(buffers).toString('utf8').trim();
}
function parseVersion(raw) {
    return raw.replace(/^git version /, '');
}
function normalizePath(pathToNormalize) {
    return path.normalize(pathToNormalize);
}
function findSpecificGit(path, onLookup) {
    return new Promise(function (c, e) {
        onLookup(path);
        exec(path, '--version').then(function (version) {
            exec(path, '--exec-path').then(function (execPath) {
                c({ path: path, version: parseVersion(version), execPath: normalizePath(execPath) });
            });
        }).catch(function (err) {
            e(err);
        });
    });
}
function exec(path, command) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (c, e) {
                    var buffers = [];
                    var child = cp.spawn(path, Array.isArray(command) ? command : [command]);
                    child.stdout.on('data', function (b) { return buffers.push(b); });
                    child.on('error', e);
                    child.on('close', function (code) { return code ? e(new Error("Git not found under '" + path + "'.")) : c(toUtf8String(buffers)); });
                })];
        });
    });
}
function findGitDarwin(onLookup) {
    return new Promise(function (c, e) {
        cp.exec('which git', function (err, gitPathBuffer) {
            if (err) {
                return e('git not found');
            }
            var path = gitPathBuffer.toString().replace(/^\s+|\s+$/g, '');
            function getVersion(path) {
                onLookup(path);
                // make sure git executes
                cp.exec('git --version', function (err, stdout) {
                    if (err) {
                        return e('git not found');
                    }
                    var version = parseVersion(stdout.trim());
                    cp.exec('git --exec-path', function (err, stdout) {
                        if (err) {
                            return e('git not found');
                        }
                        var execPath = normalizePath(stdout.trim());
                        return c({ path: path, version: version, execPath: execPath });
                    });
                });
            }
            if (path !== '/usr/bin/git') {
                return getVersion(path);
            }
            // must check if XCode is installed
            cp.exec('xcode-select -p', function (err) {
                if (err && err.code === 2) {
                    // git is not installed, and launching /usr/bin/git
                    // will prompt the user to install it
                    return e('git not found');
                }
                getVersion(path);
            });
        });
    });
}
function findSystemGitWin32(base, onLookup) {
    if (!base) {
        return Promise.reject('Not found');
    }
    return findSpecificGit(path.join(base, 'Git', 'cmd', 'git.exe'), onLookup);
}
function findGitWin32InPath(onLookup) {
    return __awaiter(this, void 0, void 0, function () {
        var path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, which('git.exe')];
                case 1:
                    path = _a.sent();
                    return [2 /*return*/, findSpecificGit(path, onLookup)];
            }
        });
    });
}
function findGitWin32(onLookup) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, findSystemGitWin32(process.env['ProgramW6432'], onLookup)
                    .then(undefined, function () { return findSystemGitWin32(process.env['ProgramFiles(x86)'], onLookup); })
                    .then(undefined, function () { return findSystemGitWin32(process.env['ProgramFiles'], onLookup); })
                    .then(undefined, function () { return findSystemGitWin32(path.join(process.env['LocalAppData'], 'Programs'), onLookup); })
                    .then(undefined, function () { return findGitWin32InPath(onLookup); })];
        });
    });
}
//# sourceMappingURL=find-git-exec.js.map