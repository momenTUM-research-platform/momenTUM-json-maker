import { toTitleCase } from '../../../src/utils/utils';
// Import the function to be tested

describe('toTitleCase', () => {
  it('should capitalize the first letter of each word and convert the rest to lowercase', () => {
    // Test cases
    expect(toTitleCase('hello world')).toBe('Hello World');
    expect(toTitleCase('this is a test')).toBe('This Is A Test');
    expect(toTitleCase('ALL CAPS')).toBe('All Caps');
    expect(toTitleCase('camelCase')).toBe('Camelcase');
    expect(toTitleCase('mIXeD CaSe tEXt')).toBe('Mixed Case Text');
  });

  it('should handle empty strings and return an empty string', () => {
    expect(toTitleCase('')).toBe('');
  });

  it('should handle strings with only one word', () => {
    expect(toTitleCase('hello')).toBe('Hello');
    expect(toTitleCase('world')).toBe('World');
  });
});
