import mapWorkspaces from '@npmcli/map-workspaces'

export async function getWorkspacePackages({
    cwd,
    packageJSON,
}): Promise<Record<string, string>> {
    const map: Map<string, string> = await mapWorkspaces({
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
