import { promisify } from 'util'
import path from 'path'

import getName from '@npmcli/name-from-folder'
import rpj from 'read-package-json-fast'
import glob from 'glob'
const pGlob = promisify(glob)

function appendNegatedPatterns(patterns) {
    const results = []
    for (let pattern of patterns) {
        const excl = pattern.match(/^!+/)
        if (excl) {
            pattern = pattern.substr(excl[0].length)
        }

        // strip off any / from the start of the pattern.  /foo => foo
        pattern = pattern.replace(/^\/+/, '')

        // an odd number of ! means a negated pattern.  !!foo ==> foo
        const negate = excl && excl[0].length % 2 === 1
        results.push({ pattern, negate })
    }

    return results
}

function getPatterns(workspaces) {
    const workspacesDeclaration = Array.isArray(workspaces.packages)
        ? workspaces.packages
        : workspaces

    if (!Array.isArray(workspacesDeclaration)) {
        throw getError({
            message: 'workspaces config expects an Array',
            code: 'EWORKSPACESCONFIG',
        })
    }

    return [
        ...appendNegatedPatterns(workspacesDeclaration),
        { pattern: '**/node_modules/**', negate: true },
    ]
}

function isEmpty(patterns) {
    return patterns.length < 2
}

function getPackageName(pkg, pathname) {
    const { name } = pkg
    return name || getName(pathname)
}

function pkgPathmame(opts) {
    return (...args) => {
        const cwd = opts.cwd ? opts.cwd : process.cwd()
        return path.join.apply(null, [cwd, ...args])
    }
}

// make sure glob pattern only matches folders
function getGlobPattern(pattern) {
    return pattern.endsWith('/') ? pattern : `${pattern}/`
}

function getError({ Type = TypeError, message, code }) {
    return Object.assign(new Type(message), { code })
}

function reverseResultMap(map: any): any {
    return new Map(Array.from(map, (item: any) => item.reverse()))
}

export async function mapWorkspaces(
    opts: {
        pkg?: Record<string, any>
        ignore?: string[]
        cwd?: string
    } = {},
): Promise<Map<string, string>> {
    if (!opts || !opts.pkg) {
        throw getError({
            message: 'mapWorkspaces missing pkg info',
            code: 'EMAPWORKSPACESPKG',
        })
    }

    const { workspaces = [] } = opts.pkg
    const patterns = getPatterns(workspaces)
    const results = new Map()
    const seen = new Set()

    if (isEmpty(patterns)) {
        return results
    }

    const getGlobOpts = () => ({
        ...opts,
        ignore: [...(opts.ignore || []), ...['**/node_modules/**']],
    })

    const getPackagePathname = pkgPathmame(opts)

    for (const item of patterns) {
        const matches = await pGlob(getGlobPattern(item.pattern), getGlobOpts())

        for (const match of matches) {
            let pkg
            const packageJsonPathname = getPackagePathname(
                match,
                'package.json',
            )
            const packagePathname = path.dirname(packageJsonPathname)

            try {
                pkg = await rpj(packageJsonPathname)
            } catch (err) {
                if (err.code === 'ENOENT') {
                    continue
                } else {
                    throw err
                }
            }

            const name = getPackageName(pkg, packagePathname)

            if (item.negate) {
                results.delete(packagePathname)
                results.delete(name)
            } else {
                seen.add(name)
                results.set(packagePathname, name)
            }
        }
    }

    return reverseResultMap(results)
}
