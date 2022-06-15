# find-git-repositories
| Linux | OS X | Windows |
| ----- | ---- | ------- |
| <a href="https://travis-ci.org/implausible/find-git-repositories"><img src="https://travis-ci.org/implausible/find-git-repositories.svg?branch=master"></a> | <a href="https://travis-ci.org/implausible/find-git-repositories"><img src="https://travis-ci.org/implausible/find-git-repositories.svg?branch=master"></a> | <a href="https://ci.appveyor.com/project/implausible/find-git-repositories"><img src="https://ci.appveyor.com/api/projects/status/06utkkpblljv1d3n/branch/master?svg=true"></a> |

```javascript
const findGitRepos = require('find-git-repositories');
findGitRepos('some/path', repos => console.log('progress:', repos))
  .then(allFoundRepositories => console.log('all the repositories found in this search:', allFoundRepositories));
```
