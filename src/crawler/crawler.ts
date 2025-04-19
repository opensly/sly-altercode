import * as fs from 'fs';
import { join } from 'path';
import path from 'path';
import { AltercodeConfig } from '../types';

export default class Crawler {
  private config: AltercodeConfig;
  public requiredFiles: string[] = [];
  
  constructor(config: AltercodeConfig) {
    this.config = config;
    this.getFilesOfDir(this.config.sourceDir);
  }
  
  private getFilesOfDir(dir: string): void {
    try {
      if (!fs.existsSync(dir)) {
        console.error(`Directory does not exist: ${dir}`);
        return;
      }
      
      const files = fs.readdirSync(dir).map(f => join(dir, f));
      
      files.forEach(f => {
        try {
          const stat = fs.statSync(f);
          
          if (stat.isDirectory()) {
            // Skip excluded directories
            if (this.isDirectoryExcluded(f)) {
              return;
            }
            this.getFilesOfDir(f);
          } else if (this.isFileAllowed(f)) {
            this.requiredFiles.push(f);
          }
        } catch (fileErr: any) {
          console.warn(`Warning: Could not process ${f}: ${fileErr.message}`);
        }
      });
    } catch (dirErr: any) {
      console.error(`Error reading directory ${dir}: ${dirErr.message}`);
    }
  }
  
  private isDirectoryExcluded(dir: string): boolean {
    const excludeDirs = this.config.excludeDirs || ['node_modules', '.git', 'dist', 'build'];
    const dirName = path.basename(dir);
    return excludeDirs.includes(dirName);
  }
  
  private isFileAllowed(file: string): boolean {
    const excludeExtns = this.config.excludeExtns || [];
    const includeExtns = this.config.includeExtns || [];
    
    if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
      return false;
    }
    
    const ext = path.extname(file);
    
    // If includeExtns is specified, only include those extensions
    if (includeExtns.length > 0) {
      return includeExtns.includes(ext);
    }
    
    // Otherwise exclude specified extensions
    for (const excludeExt of excludeExtns) {
      if (file.endsWith(excludeExt)) {
        return false;
      }
    }
    
    return true;
  }
}
