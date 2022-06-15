/*
 * Copyright (c) 2017 TypeFox. Licensed under the MIT License.
 * See the LICENSE file in the project root for license information.
 */

// The current implementation is based on https://github.com/microsoft/vscode/blob/master/extensions/git/src/git.ts#L50-L141
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as which from 'which';
import * as cp from 'child_process';

/**
 * Bare minimum information of the locally available Git executable.
 */
export interface Git {

    /**
     * The FS path to the Git executable.
     */
    readonly path: string;
    /**
     * The Git version. [`git --version`]
     */
    readonly version: string;
    /**
     * The path to wherever your core Git programs are installed. [`git --exec-path`]
     */
    readonly execPath: string;

}

export interface FindGitOptions {
    hint?: string;
    onLookup?: (path: string) => void;
}

/**
 * Resolves to the path of the locally available Git executable. Will be rejected if Git cannot be found on the system.
 * `hint` can be provided as the initial lookup path, and `onLookup` function is used for logging during the Git discovery.
 */
export default async function ({ hint, onLookup }: FindGitOptions = {}): Promise<Git> {
    const lookup = onLookup ?? (() => { });
    const first = hint ? findSpecificGit(hint, lookup) : Promise.reject<Git>(null);
    return first
        .then(undefined, async () => {
            switch (process.platform) {
                case 'darwin': return findGitDarwin(lookup);
                case 'win32': return findGitWin32(lookup);
                default: {
                    const gitOnPath = await which('git');
                    return await findSpecificGit(gitOnPath, lookup);
                }
            }
        })
        .then(null, () => Promise.reject(new Error('Git installation not found.')));
}

function toUtf8String(buffers: Buffer[]): string {
    return Buffer.concat(buffers).toString('utf8').trim();
}

function parseVersion(raw: string): string {
    return raw.replace(/^git version /, '');
}

function normalizePath(pathToNormalize: string): string {
    return path.normalize(pathToNormalize);
}

function findSpecificGit(path: string, onLookup: (path: string) => void): Promise<Git> {
    return new Promise<Git>((c, e) => {
        onLookup(path);
        exec(path, '--version').then(version => {
            exec(path, '--exec-path').then(execPath => {
                c({ path, version: parseVersion(version), execPath: normalizePath(execPath) });
            });
        }).catch(err => {
            e(err);
        });
    });
}

async function exec(path: string, command: string | string[]): Promise<string> {
    return new Promise<string>((c, e) => {
        const buffers: Buffer[] = [];
        const child = cp.spawn(path, Array.isArray(command) ? command : [command]);
        child.stdout.on('data', (b: Buffer) => buffers.push(b));
        child.on('error', e);
        child.on('close', code => code ? e(new Error(`Git not found under '${path}'.`)) : c(toUtf8String(buffers)));
    });
}

function findGitDarwin(onLookup: (path: string) => void): Promise<Git> {
    return new Promise<Git>((c, e) => {
        cp.exec('which git', (err, gitPathBuffer) => {
            if (err) {
                return e('git not found');
            }

            const path = gitPathBuffer.toString().replace(/^\s+|\s+$/g, '');

            function getVersion(path: string) {
                onLookup(path);

                // make sure git executes
                cp.exec('git --version', (err, stdout) => {

                    if (err) {
                        return e('git not found');
                    }

                    const version = parseVersion(stdout.trim());
                    cp.exec('git --exec-path', (err, stdout) => {

                        if (err) {
                            return e('git not found');
                        }

                        const execPath = normalizePath(stdout.trim());
                        return c({ path, version, execPath });
                    });

                });
            }

            if (path !== '/usr/bin/git') {
                return getVersion(path);
            }

            // must check if XCode is installed
            cp.exec('xcode-select -p', (err: any) => {
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

function findSystemGitWin32(base: string, onLookup: (path: string) => void): Promise<Git> {
    if (!base) {
        return Promise.reject<Git>('Not found');
    }

    return findSpecificGit(path.join(base, 'Git', 'cmd', 'git.exe'), onLookup);
}

async function findGitWin32InPath(onLookup: (path: string) => void): Promise<Git> {
    const path = await which('git.exe');
    return findSpecificGit(path, onLookup);
}

async function findGitWin32(onLookup: (path: string) => void): Promise<Git> {
    return findSystemGitWin32(process.env['ProgramW6432'] as string, onLookup)
        .then(undefined, () => findSystemGitWin32(process.env['ProgramFiles(x86)'] as string, onLookup))
        .then(undefined, () => findSystemGitWin32(process.env['ProgramFiles'] as string, onLookup))
        .then(undefined, () => findSystemGitWin32(path.join(process.env['LocalAppData'] as string, 'Programs'), onLookup))
        .then(undefined, () => findGitWin32InPath(onLookup));
}
