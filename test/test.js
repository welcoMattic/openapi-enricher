const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

test('_', (done) => {
    exec(`node ${path.resolve('./openapi-enricher')} ${['./test/fixtures/petstore.json', `--examplesFile ./test/fixtures/petstore-examples.json`].join(' ')}`,
        (err, out) => {
            expect(out.toString()).toBe(fs.readFileSync('./test/fixtures/enriched.json', 'utf8'))
            done();
        }
    );
})
