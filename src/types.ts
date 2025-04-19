export interface Mutation {
  searchString: string;
  replaceWith: string;
  useRegex?: boolean;
}

export interface CodemodConfig {
  sourceDir: string;
  excludeExtns?: string[];
  includeExtns?: string[];
  excludeDirs?: string[];
  mutations: Mutation[];
  dryRun?: boolean;
}

export interface ProcessingError {
  file: string;
  message: string;
}

export interface ProcessingResults {
  totalFiles: number;
  modifiedFiles: number;
  totalReplacements: number;
  errors: ProcessingError[];
}
