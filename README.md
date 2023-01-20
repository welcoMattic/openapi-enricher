# OpenAPI Enricher

> Enrich an OpenAPI spec with response examples

## Usage

1. Install openapi-enricher with `npm install openapi-enricher`
2. Write your response exemples in a JSON file, following the provided template (examples.json)
3. Run `npx openapi-enricher openapi.json -e examples.json -o enriched.json`

## Examples

Given the petstore OpenAPI specification file [petstore.json](test/fixtures/petstore.json) and a [file containing handwritten response examples](test/fixtures/petstore-examples.json).
By running `npx openapi-enricher petstore.json -e petstore-examples.json -o enriched.json` you can obtain the result exposed in the [enriched.json](test/fixtures/enriched.json) file.

Basically, it will merge the `responses` entries of both files.

## Limitations

* It support only examples for response in paths, not for components
* It support only 1 examples file at a time

## Credits

* [All contributors](https://github.com/welcomattic/openapi-enricher/graphs/contributors)

## License

OpenAPI Enricher is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
