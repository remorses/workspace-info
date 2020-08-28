#!/usr/bin/env node
import yargs from 'yargs'
import { getWorkspaceInfo } from './index'

const argv = yargs
    .option('cwd', { type: 'string' })
    .option('lerna', { type: 'boolean' })
    .option('dev', { type: 'boolean' })
    .option('peer', { type: 'boolean' })
    .option('verbose', { alias: 'v', type: 'boolean' })
    .help('help').argv

async function main() {
    const res = await getWorkspaceInfo({
        cwd: argv.cwd || process.cwd(),
        includeDev: argv.dev,
        includePeer: argv.peer,
        useLerna: argv.lerna,
    })
    console.log(JSON.stringify(res, null, 4))
}

main().catch((e) => console.error(argv.verbose ? e : e.message))
