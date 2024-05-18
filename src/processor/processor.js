// Import dependencies
import { promises as fs } from 'fs';

export default class FileProcessor {
  files;
  replacements;

  constructor(files, replacements) {
    this.files = files;
    this.replacements = replacements;
  }

  async findAndReplaceInFiles() {
    for (const file of this.files) {
      try {
        let data = await fs.readFile(file, 'utf8'); // Read the file content
        for (const { searchString, replaceWith } of this.replacements) {
          data = data.replace(new RegExp(searchString, 'g'), replaceWith); // Replace each string
        }
        await fs.writeFile(file, data, 'utf8'); // Write the updated content back to the file
        console.log(`Successfully updated ${file}`);
      } catch (err) {
        console.error(`Error processing file ${file}:`, err);
      }
    }
  }
}
