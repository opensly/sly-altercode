#!/usr/bin/env node

// Import dependencies
import * as fs from 'fs';

// Import internal files
import Crawler from './crawler/crawler';

const configPath  = process.argv[3];
let appConfig;

fs.readFile(configPath, 'utf8', function (err, data) {
  if (err) throw err;

  appConfig = JSON.parse(data);
  let list  = new Crawler(appConfig);
  console.log('Impact files - ', list.requiredFiles.length);
  console.log(list.requiredFiles);

});
