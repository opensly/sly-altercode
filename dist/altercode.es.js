#!/usr/bin/env node
import * as fs from 'fs';
import { promises } from 'fs';
import { join } from 'path';

// Import dependencies

class Crawler {
  config;
  requiredFiles = [];
  
  constructor(config) {
    this.config = config;
    this.getFilesOfDir(this.config.sourceDir);
  }

  getFilesOfDir(dir) {
    const files = fs.readdirSync(dir).map(f => join(dir, f));
    files.forEach(f => {
      if (fs.statSync(f).isDirectory()) {
        this.getFilesOfDir(f);
      } else if (this.isFileAllowed(f)) {
        this.requiredFiles.push(f);
      }
    });
  }

  isFileAllowed(file) {
    const excludeExtns = this.config.excludeExtns || [];
    if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
      return false;
    }
    for (const ext of excludeExtns) {
      if (file.includes(ext)) {
        return false;
      }
    }
    return true;
  }

}

// Import dependencies

class FileProcessor {
  files;
  replacements;

  constructor(files, replacements) {
    this.files = files;
    this.replacements = replacements;
  }

  async findAndReplaceInFiles() {
    for (const file of this.files) {
      try {
        let data = await promises.readFile(file, 'utf8'); // Read the file content
        for (const { searchString, replaceWith } of this.replacements) {
          data = data.replace(new RegExp(searchString, 'g'), replaceWith); // Replace each string
        }
        await promises.writeFile(file, data, 'utf8'); // Write the updated content back to the file
        console.log(`Successfully updated ${file}`);
      } catch (err) {
        console.error(`Error processing file ${file}:`, err);
      }
    }
  }
}

const configPath  = process.argv[3];
let appConfig;

fs.readFile(configPath, 'utf8', function (err, data) {
  if (err) throw err;

  appConfig = JSON.parse(data);
  const crawler = new Crawler(appConfig);

  const fileProcessor = new FileProcessor(crawler.requiredFiles, appConfig.mutations);
  fileProcessor.findAndReplaceInFiles();

});
