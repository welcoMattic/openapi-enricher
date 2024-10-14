#!/usr/bin/env node
"use strict"

const fs = require('fs')
const program = require('commander')
const yaml = require('@stoplight/yaml');

program
    .arguments('<oaFile>')
    .usage('<file> [options]')
    .description(require('./package.json').description)
    .option('-o, --output <output>', 'name of the enriched OpenAPI file')
    .option('-e, --examplesFile <examplesFile>', 'file to specify HTTP response examples')
    .option('-f, --format <format>', 'format used to read and write OpenAPI files (input and output), and examples file', 'json')
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
    const format = options.format

    if (format !== 'json' && format !== 'yaml' && format !== 'yml') {
        console.error('\x1b[31m', `--format option must be equal to "json", "yaml" or "yml"`)
        return
    }

    let oa = ''
    let examples = ''
    switch (true) {
        case format === 'json':
            oa = JSON.parse(fs.readFileSync(oaFile, 'utf8'))
            examples = JSON.parse(fs.readFileSync(options.examplesFile, 'utf8'))
            break

        case format === 'yaml':
        case format === 'yml':
            oa = yaml.parse(fs.readFileSync(oaFile, 'utf8'))
            examples = yaml.parse(fs.readFileSync(options.examplesFile, 'utf8'))
            break
    }

    Object.entries(oa.paths).forEach(([path, methods]) => {
        Object.entries(methods).forEach(([method, methodOptions]) => {
            if (examples.paths.hasOwnProperty(path)) {
                for (const [statusCode, response] of Object.entries(methodOptions.responses)) {
                    if (!response.hasOwnProperty('content')) {
                        continue;
                    }

                    for (const contentType of Object.keys(response.content)) {
                        if (examples['paths'][path][method]['responses'][statusCode]?.['content'][contentType]['examples']) {
                            oa['paths'][path][method]['responses'][statusCode]['content'][contentType]['examples'] = examples['paths'][path][method]['responses'][statusCode]['content'][contentType]['examples']
                        }
                    }
                }
            }
        })
    })

    let output = '';
    switch (true) {
        case format === 'json':
            output = JSON.stringify(oa, null, 2)
            break

        case format === 'yaml':
        case format === 'yml':
            output = yaml.safeStringify(oa, { lineWidth: Infinity, indent: 2 })
            break
    }

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
