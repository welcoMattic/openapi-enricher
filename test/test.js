const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

test('_json', (done) => {
    exec(`node ${path.resolve('./openapi-enricher')} ${[
        `./test/fixtures/json/petstore.json`,
        `--examplesFile ./test/fixtures/json/petstore-examples.json`
    ].join(' ')}`,
        (err, out) => {
            expect(out.toString()).toBe(fs.readFileSync('./test/fixtures/json/enriched.json', 'utf8'))
            done()
        }
    )
})

test('_yaml', (done) => {
    exec(`node ${path.resolve('./openapi-enricher')} ${[
            `./test/fixtures/yaml/petstore.yaml`,
            `--examplesFile ./test/fixtures/yaml/petstore-examples.yaml`,
            `--format yaml`
        ].join(' ')}`,
        (err, out) => {
            expect(out.toString()).toBe(fs.readFileSync('./test/fixtures/yaml/enriched.yaml', 'utf8'))
            done()
        }
    )
    exec(`node ${path.resolve('./openapi-enricher')} ${[
            `./test/fixtures/yaml/petstore.yml`,
            `--examplesFile ./test/fixtures/yaml/petstore-examples.yml`,
            `--format yml`
        ].join(' ')}`,
        (err, out) => {
            expect(out.toString()).toBe(fs.readFileSync('./test/fixtures/yaml/enriched.yml', 'utf8'))
            done()
        }
    )
})
