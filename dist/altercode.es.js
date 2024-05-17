#!/usr/bin/env node
import * as fs from 'fs';
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

const configPath  = process.argv[3];
let appConfig;

fs.readFile(configPath, 'utf8', function (err, data) {
  if (err) throw err;

  appConfig = JSON.parse(data);
  let list  = new Crawler(appConfig);
  console.log('Impact files - ', list.requiredFiles.length);
  console.log(list.requiredFiles);

});
