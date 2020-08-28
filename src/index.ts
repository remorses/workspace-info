import {
    getWorkspacePackages,
    getPackageDependencies,
    readJsonFile,
    transformLernaConfigToYarnConfig,
} from './support'
import path from 'path'

type WorkspacePackage = {
    location: string
    workspaceDependencies: string[]
    // TODO what is mismatchedWorkspaceDependencies?
    mismatchedWorkspaceDependencies?: string[]
}

export type WorkspaceInfo = {
    [k: string]: WorkspacePackage
}

export async function getWorkspaceInfo({
    cwd,
    useLerna = false,
    includeDev = false,
    includePeer = false,
}) {
    let packageJSON = await readJsonFile(
        path.resolve(cwd, useLerna ? 'lerna.json' : 'package.json'),
    )
    if (useLerna) {
        packageJSON = transformLernaConfigToYarnConfig(packageJSON)
    }
    const packagesMap = await getWorkspacePackages({
        packageJSON,
        cwd,
    })

    const workspaceInfos: WorkspaceInfo[] = await Promise.all(
        Object.keys(packagesMap).map(async (k) => {
            const location = packagesMap[k]
            const currentPackageJson = await readJsonFile(
                path.resolve(location, 'package.json'),
            )
            return {
                [k]: {
                    location,
                    mismatchedWorkspaceDependencies: [],
                    workspaceDependencies: getPackageDependencies({
                        includeDev,
                        includePeer,
                        packageJSON: currentPackageJson,
                    }).filter((x) => packagesMap[x]),
                },
            }
        }),
    )

    const workspaceInfo: WorkspaceInfo = Object.assign({}, ...workspaceInfos)

    return workspaceInfo
}

// {
//     '@ryancavanaugh/folder-pkg2': {
//         location: 'packages/folder/pkg2',
//         workspaceDependencies: ['@ryancavanaugh/pkg1'],
//         mismatchedWorkspaceDependencies: [],
//     },
//     '@ryancavanaugh/pkg1': {
//         location: 'packages/pkg1',
//         workspaceDependencies: [],
//         mismatchedWorkspaceDependencies: [],
//     },
//     '@ryancavanaugh/pkg2': {
//         location: 'packages/pkg2',
//         workspaceDependencies: [
//             '@ryancavanaugh/folder-pkg2',
//             '@ryancavanaugh/pkg1',
//         ],
//         mismatchedWorkspaceDependencies: [],
//     },
//     '@ryancavanaugh/pkg3': {
//         location: 'packages/pkg3',
//         workspaceDependencies: [
//             '@ryancavanaugh/pkg1',
//             '@ryancavanaugh/pkg2',
//         ],
//         mismatchedWorkspaceDependencies: [],
//     },
// }
