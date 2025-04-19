import { CodemodConfig } from '../types';

/**
 * Validates the configuration object
 * @param {CodemodConfig} config - The configuration object
 * @returns {Array<string>} - Array of error messages, empty if valid
 */
export function validateConfig(config: CodemodConfig): string[] {
  const errors: string[] = [];
  
  if (!config) {
    errors.push('Configuration is empty or invalid');
    return errors;
  }
  
  // Check required fields
  if (!config.sourceDir) {
    errors.push('sourceDir is required');
  } else if (typeof config.sourceDir !== 'string') {
    errors.push('sourceDir must be a string');
  }
  
  // Check mutations
  if (!config.mutations || !Array.isArray(config.mutations)) {
    errors.push('mutations must be an array');
  } else {
    config.mutations.forEach((mutation, index) => {
      if (!mutation.searchString) {
        errors.push(`mutations[${index}]: searchString is required`);
      }
      if (!('replaceWith' in mutation)) {
        errors.push(`mutations[${index}]: replaceWith is required`);
      }
    });
  }
  
  return errors;
}
