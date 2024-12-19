import { describe, it, expect } from 'vitest';
import { formatUpperCase } from '../text';

describe('Text Utils', () => {
  describe('formatUpperCase', () => {
    it('should convert text to uppercase', () => {
      // Arrange
      const input = 'hello world';
      const expected = 'HELLO WORLD';

      // Act
      const result = formatUpperCase(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle empty string', () => {
      // Arrange
      const input = '';

      // Act
      const result = formatUpperCase(input);

      // Assert
      expect(result).toBe('');
    });

    it('should handle already uppercase text', () => {
      // Arrange
      const input = 'HELLO';

      // Act
      const result = formatUpperCase(input);

      // Assert
      expect(result).toBe('HELLO');
    });

    it('should handle mixed case text', () => {
      // Arrange
      const input = 'Hello World';

      // Act
      const result = formatUpperCase(input);

      // Assert
      expect(result).toBe('HELLO WORLD');
    });
  });
});
