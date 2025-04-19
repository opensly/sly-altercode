/**
 * Escapes special characters in a string for use in a regular expression
 */
export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
