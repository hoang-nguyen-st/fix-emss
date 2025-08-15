const CHARACTER_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar: 'il1Lo0O',
  ambiguous: '{}[]()/\\\'"`~,;:.<>',
};

/**
 * Remove unwanted characters from the source string.
 * @param source - The original string.
 * @param charsToRemove - Characters to remove.
 * @returns String with unwanted characters removed.
 */
function removeChars(source: string, charsToRemove: string): string {
  return [...source].filter((char) => !charsToRemove.includes(char)).join('');
}

/**
 * Get a random character from the input string.
 * @param chars - String of characters to choose from.
 * @returns A random character.
 */
function getRandomChar(chars: string): string {
  const index = Math.floor(Math.random() * chars.length);
  return chars[index];
}

/**
 * Shuffle array elements randomly.
 * @param arr - Array to shuffle.
 * @returns Array shuffled randomly.
 */
function shuffleArray(arr: string[]): string[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a random password ensuring it contains at least:
 * - 1 uppercase letter (excluding similar characters)
 * - 1 lowercase letter (excluding similar characters)
 * - 1 number (excluding similar characters)
 * - 1 special character (excluding ambiguous characters)
 *
 * @param length - Password length, default is 8. Must be ≥ 8.
 * @returns Random password meeting the requirements.
 * @throws If length is less than 8 characters.
 */
export function generateRandomPassword(length = 8): string {
  if (length < 8) {
    throw new Error('Password length must be at least 8 characters');
  }

  const safeUpper = removeChars(CHARACTER_SETS.uppercase, CHARACTER_SETS.similar);
  const safeLower = removeChars(CHARACTER_SETS.lowercase, CHARACTER_SETS.similar);
  const safeNumbers = removeChars(CHARACTER_SETS.numbers, CHARACTER_SETS.similar);
  const safeSymbols = removeChars(CHARACTER_SETS.symbols, CHARACTER_SETS.ambiguous);

  const allChars = safeUpper + safeLower + safeNumbers + safeSymbols;

  const requiredChars = [
    getRandomChar(safeUpper),
    getRandomChar(safeLower),
    getRandomChar(safeNumbers),
    getRandomChar(safeSymbols),
  ];

  const remainingLength = length - requiredChars.length;
  const remainingChars = Array.from({ length: remainingLength }, () => getRandomChar(allChars));

  const password = shuffleArray([...requiredChars, ...remainingChars]).join('');
  return password;
}
