# OpenAPI Enricher

> Enrich an OpenAPI spec with response examples

## Usage

1. Install openapi-enricher with `npm install openapi-enricher`
2. Write your response exemples in a JSON file, following the provided template (examples.json)
3. Run `npw openapi-enricher openapi.json -e examples.json -o enriched.json`

## Limitations

* It supports only JSON OpenAPI spec (for now)
* It support only examples for response in paths, not for components

## Credits

* [All contributors](https://github.com/welcomattic/openapi-enricher/graphs/contributors)

## License

OpenAPI Enricher is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
