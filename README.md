# workspace-info

yarn workspace info implementation for yarn v2 berry, lerna and npm workspaces

```
yarn add workspace-info
```

```js
import { getWorkspaceInfo } from 'workspace-info'

console.log(
    await getWorkspaceInfo({
        cwd,
        useLerna: false,
    }),
)

// {
//     a: {
//         location: '.../tests/example-workspace/packages/a',
//         mismatchedWorkspaceDependencies: [],
//         workspaceDependencies: ['b', 'd'],
//     },
//     b: {
//         location: '.../tests/example-workspace/packages/b',
//         mismatchedWorkspaceDependencies: [],
//         workspaceDependencies: ['d'],
//     },
//     c: {
//         location: '.../tests/example-workspace/packages/c',
//         mismatchedWorkspaceDependencies: [],
//         workspaceDependencies: ['b'],
//     },
//     d: {
//         location: '.../tests/example-workspace/packages/d',
//         mismatchedWorkspaceDependencies: [],
//         workspaceDependencies: ['c'],
//     },
// }
```
