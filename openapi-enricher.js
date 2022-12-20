#!/usr/bin/env node
"use strict"

const fs = require('fs')
const program = require('commander')

program
    .arguments('<oaFile>')
    .usage('<file> [options]')
    .description(require('./package.json').description)
    .option('-o, --output <output>', 'save the enriched OpenAPI file as JSON')
    .option('-e, --examplesFile <examplesFile>', 'the file to specify HTTP response examples')
    .version(require('./package.json').version, '--version')
    .option('-v, --verbose', 'verbosity that can be increased', increaseVerbosity, 0)
    .action(run)
    .exitOverride((err) => {
        if (
            err.code === "commander.missingArgument" ||
            err.code === "commander.unknownOption"
        ) {
            process.stdout.write("\n")
            program.outputHelp()
        }

        process.exit(err.exitCode)
    })
    .parse(process.argv)

function increaseVerbosity(dummyValue, previous) {
    return previous + 1
}

async function run(oaFile, options) {
    let oa = JSON.parse(fs.readFileSync(oaFile, 'utf8'))

    let examples = JSON.parse(fs.readFileSync(options.examplesFile, 'utf8'))
    Object.entries(oa.paths).forEach(([path, methods]) => {
        Object.entries(methods).forEach(([method, methodOptions]) => {
            if (examples.paths.hasOwnProperty(path)) {
                oa.paths[path][method] = Object.assign({}, methodOptions, examples.paths[path][method])
            }
        });
    });

    let output = JSON.stringify(oa, null, 2)

    if (options.output) {
        try {
            fs.writeFileSync(options.output, output, 'utf8')
            console.info(`- Output file:\t\t${options.output}`)
        } catch (err) {
            console.error('\x1b[31m', `Output file error - no such file or directory "${options.output}"`)
            if (options.verbose >= 1) {
                console.error(err)
            }
        }
    } else {
        console.log(output)
    }
}
