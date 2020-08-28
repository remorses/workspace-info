import assert from 'assert'
import { readFileSync } from 'fs'
import { getWorkspacePackages } from '../src/support'
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
    console.log(deps)
})
