# CypherVault

CypherVault is a Node.js library designed to simplify the management and loading of Cypher query files for Neo4j graph database applications. With support for multiple file extensions, CypherVault streamlines the process of reading Cypher queries from a directory structure and providing them as a record object for easy access within your application.

## Updates in Version 2.0.0

- **Asynchronous Loading**: The `loadQueries` function is now fully asynchronous, using `Promise.all` to handle concurrent file reading. This update brings improved performance and better integration with modern Node.js applications.

## Features

- Supports `.cypher`, `.cql`, and `.cyp` file extensions for Cypher queries.
- Recursively reads a given directory path to asynchronously load all supported query files.
- Organizes queries in a `Record<string, string>` structure, using the file path (minus the root path and extension) as the key.

## Installation

To install CypherVault, use npm:

```bash
npm install cypher-vault
```

Or, if you prefer using yarn:

```bash
yarn add cypher-vault
```

## Usage

To use CypherVault in your project, follow these steps:

1. Import the `CypherVault` class from the library.
2. Instantiate the class with a path to the directory containing your Cypher query files.
3. Call `loadQueries` async function to load the queries.

Here's an example:

```javascript
import { CypherVault } from "cypher-vault";

// Path to the directory where Cypher queries are stored
const queryPath = "src/path/to/cypher/queries";

// Create a new instance of CypherVault
const cypherVault = new CypherVault(queryPath);

// Load queries
const queries = cypherVault.loadQueries();

// Access a query by its key
const updateUser = await queries["user/update"];
```

## Motivation

In the journey through the realms of Neo4j, it quickly becomes apparent that Cypher queries evolve. They grow from the simplicity of `MATCH (p:Person) RETURN p` into intricate statements capable of unveiling deep insights within connected data. However, when these queries are nestled within JavaScript or TypeScript code, their complexity can become overwhelming. They're not just code; they're the cartographers of our data landscape, and they deserve their own space.

The clarity of thought and organization often reflects in the structure of our work. I envisioned my queries residing not just anywhere but in a place they could call home — a dedicated directory where each could be accessed without clutter, yet with the efficiency I demanded. No longer would the queries be mixed with code, obscured within template literals. Instead, they would stand in their own files, clear and distinct, ready to be called upon like well-organized tomes in a library.

The structure I had in mind was simple yet intuitive:

```
- src/
  - cypher/
    - user/
      - insert.cypher
      - update.cypher
```

With such an arrangement, accessing my Cypher queries needed to be as straightforward as referencing `queries["user/insert"]` or `queries["user/update"]` (see example section below).

This would not only streamline the development experience but also pave the way for easier maintenance and scalability of the codebase. Thus, the creation of CypherVault — a means to encapsulate the complexity of Neo4j queries and harness their power with elegance and efficiency.

## API Reference

### CypherVault(queryPath: string)

Constructor to create a new instance of CypherVault.

- `queryPath`: A string representing the path to the directory containing the Cypher query files, relative to your current working directory.

### async loadQueries(): Promise<Record<string, string>>

Asynchronously loads all the Cypher queries from the directory path provided when the instance was created. The function returns a promise that resolves to a record. The record's keys are derived from the relative file paths, excluding the root path and file extension. The record's values are the contents of the query files. This function must be awaited or used with `.then()` to handle the returned promise.

## Contributing

Contributions are welcome! If you have suggestions for how CypherVault could be improved, or if you encounter any issues, please open an issue or submit a pull request.

## License

CypherVault is [MIT licensed](./LICENSE.md).

Before contributing or using the library, please review the full license details to ensure it is suitable for your use case.
