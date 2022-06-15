/*
 * Copyright (c) 2017 TypeFox. Licensed under the MIT License.
 * See the LICENSE file in the project root for license information.
 */

import * as fs from 'fs';
import { expect } from 'chai';
import findGit, { Git } from './find-git-exec';

describe('find-git-exec', async () => {

    it('find', async function () {
        this.timeout(60_000);
        const git = await findGit({ onLookup: p => console.log(`[TRACE]: Git discovery: ${p}`) });
        const { path, version, execPath } = git;
        expect(fs.existsSync(path), `[path]: expected ${path} to exist on the filesystem`).to.be.true;
        expect(fs.existsSync(execPath), `[execPath]: expected ${execPath} to exist on the filesystem`).to.be.true;
        expect(version.startsWith('2'), `[version]: expected version 2.x was ${version} instead`).to.be.true;
        const promises: Array<Promise<Git>> = [];
        for (let i = 0; i < 100; i++) {
            promises.push(findGit());
        }
        const results = await Promise.all(promises);
        results.forEach(({ version: actualVersion, path: actualPath, execPath: actualExecPath }) => {
            expect(actualVersion).to.be.deep.equal(version, `Expected ${version} as 'version', got ${actualPath} instead.`);
            expect(actualPath).to.be.deep.equal(path, `Expected ${path} as 'path', got ${actualPath} instead.`);
            expect(actualExecPath).to.be.deep.equal(execPath, `Expected ${path} as 'execPath', got ${actualPath} instead.`);
        })
    });

});