import assert from 'assert'
import { readFileSync } from 'fs'
import { getWorkspacePackages } from '../src/support'
import { getWorkspaceInfo } from '../src'
import path, { dirname } from 'path'

const packageJsonPath = 'tests/example-workspace/package.json'
const cwd = path.resolve(dirname(packageJsonPath))
const packageJSON = JSON.parse(readFileSync(packageJsonPath).toString())

it('ready', () => {
    assert(true)
})

it('getDependencies', async () => {
    const deps = await getWorkspacePackages({
        packageJSON,
        cwd,
    })
    assert(Object.keys(deps).length)
    console.log(deps)
})

it('getWorkspaceInfo', async () => {
    const deps = await getWorkspaceInfo({
        cwd,
    })
    assert(Object.keys(deps).length)
    console.log(deps)
})

it('getWorkspaceInfo with lerna', async () => {
    const deps = await getWorkspaceInfo({
        cwd,
        useLerna: true,
    })
    assert(Object.keys(deps).length)
    console.log(deps)
})
