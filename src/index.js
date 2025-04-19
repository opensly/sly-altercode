#!/usr/bin/env node
import * as fs from 'fs';
import { join } from 'path';
import Crawler from './crawler/crawler';
import FileProcessor from './processor/processor';
import { validateConfig } from './utils/configValidator';

// Get command-line arguments
const args = process.argv.slice(2);
const configPath = args[1] || './codemod.config.json';
const isDryRun = args.includes('--dry-run') || args.includes('-d');

// Banner
console.log('\n===============================');
console.log('🛠          ALTERCODE         🛠');
console.log('===============================\n');

// Main execution
async function run() {
  try {
    console.log(`Loading config from: ${configPath}`);
    
    // Check if config file exists
    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found at "${configPath}"`);
    }
    
    // Read and parse config
    const data = fs.readFileSync(configPath, 'utf8');
    const appConfig = JSON.parse(data);
    
    // Validate config
    const configErrors = validateConfig(appConfig);
    if (configErrors.length > 0) {
      console.error('❌ Invalid configuration:');
      configErrors.forEach(err => console.error(`   - ${err}`));
      process.exit(1);
    }
    
    // Set dry run mode
    if (isDryRun) {
      console.log('🔍 DRY RUN MODE: No files will be modified\n');
      appConfig.dryRun = true;
    }
    
    // Start the process
    console.log(`🔎 Crawling directory: ${appConfig.sourceDir}`);
    const crawler = new Crawler(appConfig);
    const fileCount = crawler.requiredFiles.length;
    
    console.log(`✓ Found ${fileCount} files to process`);
    
    if (fileCount === 0) {
      console.log('No matching files found. Please check your configuration.');
      process.exit(0);
    }
    
    const fileProcessor = new FileProcessor(crawler.requiredFiles, appConfig.mutations, appConfig.dryRun);
    const results = await fileProcessor.findAndReplaceInFiles();
    
    // Report summary
    console.log('\n======= SUMMARY =======');
    console.log(`Total files processed: ${results.totalFiles}`);
    console.log(`Files modified: ${results.modifiedFiles}`);
    console.log(`Total replacements: ${results.totalReplacements}`);
    console.log(`Errors: ${results.errors.length}`);
    
    if (results.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      results.errors.forEach(err => console.log(`   - ${err.file}: ${err.message}`));
    }
    
    console.log('\n✅ Codemod execution complete!');
    if (isDryRun) {
      console.log('Run without the --dry-run flag to apply changes');
    }
    
  } catch (err) {
    console.error(`\n❌ Error: ${err.message}`);
    process.exit(1);
  }
}

run();
