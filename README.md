# Altercode

Altercode is a powerful TypeScript-based CLI tool/library to assist you with large-scale code transformations that can be partially automated but still require human oversight and occasional intervention. Altercode is completely open source and free to use.

## Features
- **Easy Configuration** - Simple JSON configuration
- **TypeScript Support** - First-class TypeScript support
- **Dry Run Mode** - Test changes before applying them
- **Pattern Matching** - Support for both literal strings and regex patterns
- **Detailed Reporting** - Clear summary of all changes made
- **Granular Control** - Include/exclude specific files and directories

## Installation
Install the package as a development dependency with the below command:
```
npm i sly-altercode --save-dev
```

## Usage

### 1. Create a configuration file
Create a config file named `altercode.config.json` at the root level of your repository:
```
{
  "sourceDir": "./src/app",
  "includeExtns": [".js", ".jsx", ".ts", ".tsx"],
  "excludeExtns": [".test.ts", ".enum.ts", ".constants.ts"],
  "excludeDirs": ["node_modules", "dist", "build"],
  "mutations": [
    { 
      "searchString": "page-wrapper", 
      "replaceWith": "page-container" 
    },
    { 
      "searchString": "const\\s+([a-zA-Z]+)\\s*=\\s*\\(\\)\\s*=>\\s*{", 
      "replaceWith": "function $1() {",
      "useRegex": true
    }
  ]
}
```

### 2. Add the command
Add the below command in the scripts of your package.json
```
"scripts": {
  "assist": "altercode altercode.config.json"
}
```

### 3. Run Altercode
You're all set. Now run the assist command to process your code shift tasks:
``` 
npm run assist
```
For a dry run (no actual file changes):
```
npm run assist -- --dry-run
```

## Configuration Options

| Option         | Type         | Description                                                                 |
|----------------|--------------|-----------------------------------------------------------------------------|
| `sourceDir`    | string       | Directory to search for files (**required**)                                |
| `includeExtns` | string[]     | File extensions to include (if specified, only these will be processed)     |
| `excludeExtns` | string[]     | File extensions to exclude                                                  |
| `excludeDirs`  | string[]     | Directories to exclude from processing                                      |
| `mutations`    | Mutation[]   | Array of search and replace operations                                      |

## Mutation Options

| Option         | Type     | Description                                                             |
|----------------|----------|-------------------------------------------------------------------------|
| `searchString` | string   | The string or pattern to search for (**required**)                      |
| `replaceWith`  | string   | The replacement string (**required**)                                   |
| `useRegex`     | boolean  | Whether to treat `searchString` as a regex pattern (default: `false`)   |

## Command Line Options

| Option            | Description                                              |
|-------------------|----------------------------------------------------------|
| `--dry-run`, `-d` | Run without making actual changes to files               |

## Examples

### Basic String Replacement
```
{
  "sourceDir": "./src",
  "mutations": [
    { 
      "searchString": "import React from 'react';", 
      "replaceWith": "import * as React from 'react';" 
    }
  ]
}
```

### Using Regular Expressions
```
{
  "sourceDir": "./src",
  "mutations": [
    {
      "searchString": "const\\s+([a-zA-Z]+)\\s*=\\s*\\(\\)\\s*=>\\s*{",
      "replaceWith": "function $1() {",
      "useRegex": true
    }
  ]
}
```

### Working with Specific File Types
```
{
  "sourceDir": "./src",
  "includeExtns": [".tsx", ".jsx"],
  "mutations": [
    { 
      "searchString": "<div className=\"container\">", 
      "replaceWith": "<Container>" 
    },
    { 
      "searchString": "</div>", 
      "replaceWith": "</Container>" 
    }
  ]
}
```

## License
This project is licensed under the MIT license. See the LICENSE file for more info.
