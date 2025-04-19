import { promises as fs } from 'fs';
import { escapeRegExp } from '../utils/stringUtils';
import { Mutation, ProcessingResults, ProcessingError } from '../types';

export default class FileProcessor {
  private files: string[];
  private replacements: Mutation[];
  private dryRun: boolean;
  
  constructor(files: string[], replacements: Mutation[], dryRun = false) {
    this.files = files;
    this.replacements = replacements;
    this.dryRun = dryRun;
  }
  
  async findAndReplaceInFiles(): Promise<ProcessingResults> {
    const results: ProcessingResults = {
      totalFiles: this.files.length,
      modifiedFiles: 0,
      totalReplacements: 0,
      errors: []
    };
    
    for (const file of this.files) {
      try {
        // Read the file content
        let data = await fs.readFile(file, 'utf8');
        let originalData = data;
        let fileReplacements = 0;
        
        // Process each replacement
        for (const { searchString, replaceWith, useRegex = false } of this.replacements) {
          let pattern: RegExp;
          
          // Create regex pattern safely
          if (useRegex) {
            try {
              pattern = new RegExp(searchString, 'g');
            } catch (regexError: any) {
              results.errors.push({
                file,
                message: `Invalid regex pattern: ${regexError.message}`
              });
              continue;
            }
          } else {
            pattern = new RegExp(escapeRegExp(searchString), 'g');
          }
          
          // Count replacements in this file for this pattern
          const matches = data.match(pattern);
          const matchCount = matches ? matches.length : 0;
          
          // Replace content
          data = data.replace(pattern, replaceWith);
          fileReplacements += matchCount;
          results.totalReplacements += matchCount;
        }
        
        // Only consider a file modified if content changed
        if (data !== originalData) {
          if (!this.dryRun) {
            await fs.writeFile(file, data, 'utf8');
          }
          results.modifiedFiles++;
          console.log(`✓ ${this.dryRun ? 'Would modify' : 'Modified'} ${file} (${fileReplacements} replacements)`);
        }
      } catch (err: any) {
        results.errors.push({
          file,
          message: err.message
        });
        console.error(`❌ Error processing file ${file}: ${err.message}`);
      }
    }
    
    return results;
  }
}
