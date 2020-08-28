import fs from 'fs'
import path from 'path'
import { mapWorkspaces } from './map-workspaces'

export async function getWorkspacePackages({
    cwd,
    packageJSON,
}): Promise<Record<string, string>> {
    const map = await mapWorkspaces({
        pkg: packageJSON,
        cwd,
    })
    return Object.assign(
        {},
        ...Array.from(map.entries()).map(([k, v]) => {
            return { [k]: v }
        }),
    )
}

export async function readJsonFile(filePath) {
    const packageJSON = JSON.parse(
        await fs.promises
            .readFile(path.resolve(filePath))
            .then((x) => x.toString()),
    )
    return packageJSON
}

export function getPackageDependencies({
    packageJSON,
    includeDev,
    includePeer,
}) {
    let names = Object.keys(packageJSON.dependencies || {})
    if (includeDev) {
        names = names.concat(Object.keys(packageJSON.devDependencies || {}))
    }
    if (includePeer) {
        names = names.concat(Object.keys(packageJSON.peerDependencies || {}))
    }
    return names
}

export function transformLernaConfigToYarnConfig(lernaJson) {
    if (lernaJson?.packages) {
        return {
            ...lernaJson,
            workspaces: {
                packages: lernaJson?.packages,
            },
        }
    }
    return lernaJson
}
