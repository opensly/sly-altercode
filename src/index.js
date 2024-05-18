#!/usr/bin/env node

// Import dependencies
import * as fs from 'fs';

// Import internal files
import Crawler from './crawler/crawler';
import FileProcessor from './processor/processor';

const configPath  = process.argv[3];
let appConfig;

fs.readFile(configPath, 'utf8', function (err, data) {
  if (err) throw err;

  appConfig = JSON.parse(data);
  const crawler = new Crawler(appConfig);

  const fileProcessor = new FileProcessor(crawler.requiredFiles, appConfig.mutations);
  fileProcessor.findAndReplaceInFiles();

});
