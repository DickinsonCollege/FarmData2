# find-git-exec
[![Build Status](https://github.com/TypeFox/find-git-exec/actions/workflows/actions.yml)](https://github.com/TypeFox/find-git-exec/actions/workflows/actions.yml)

A lightweight library for locating the Git executable on the host system.
This library is a stripped down version of the Git discovery logic [implemented and used by VS Code](https://github.com/microsoft/vscode/blob/master/extensions/git/src/git.ts#L50-L141).

## Install
```bash
# with npm
npm i find-git-exec
# with yarn
yarn add find-git-exec
```

## Build
```bash
yarn build
```

## Test
```bash
yarn test
```

## Example
```javascript
import findGit from 'find-git-exec';

try {
    const { version, path } = await findGit();
    console.log(`Git version: ${version}`);
    console.log(`Git path: ${path}`);
} catch (error) {
    console.error(error);
}
```

## License
Copyright (c) - TypeFox.
Licensed under the [MIT](LICENSE) license.