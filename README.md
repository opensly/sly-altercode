# Altercode

Altercode is a simple node based CLI tool/library to assist you with large-scale code shift that can be partially automated but still require human oversight and occasional intervention. Altercode is completely open source and free to use.

## Usage

Install the package as a  with the below command
```
npm i sly-altercode --save-dev
```

Create a config file named `altercode.config.json` at the root level of your repository.
```
{
  "sourceDir": "./src/app",
  "excludeExtns": [".test.ts", ".enum.ts", ".constants.ts", ...]
  "mutations": [
    { 
      "searchString": "page-wrapper", 
      "replaceWith": "page-container" 
    },
    { 
      "searchString": "...", 
      "replaceWith": "..." 
    },
    ...
  ]
}
```

Add the below command in the scripts of your package.json
```
"scripts": {
  "assist": "altercode --config altercode.config.json"
}
```

You're all set. Now run the assist command to process your code shift tasks
``` 
npm run assist
```
## License
This project is licensed under the MIT license. See the LICENSE file for more info.
