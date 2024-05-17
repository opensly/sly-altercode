# Altercode

Altercode is CLI tool helps developers to do code shift tasks seamlessly.

## Usage

Install the package as a  with the below command
```
npm i sly-altercode --save-dev
```

Create a config file named `altercode.config.json` at the root level of your repository.
```
{
  "sourceDir": "./src/app"
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
