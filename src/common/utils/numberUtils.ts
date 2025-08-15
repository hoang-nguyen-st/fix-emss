/**
 * Generate a random integer between the specified minimum and maximum values (inclusive).
 *
 * @param min - The minimum value (inclusive).
 * @param max - The maximum value (inclusive).
 * @returns A random integer between min and max (inclusive).
 *
 * @example
 * ```typescript
 * getRandomNumber(1, 10);    // Returns a number between 1 and 10
 * getRandomNumber(0, 100);   // Returns a number between 0 and 100
 * getRandomNumber(-5, 5);    // Returns a number between -5 and 5
 * ```
 *
 * @throws {Error} If min is greater than max.
 */
export function getRandomNumber(min: number, max: number): number {
  if (min > max) {
    throw new Error('Minimum value cannot be greater than maximum value');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
