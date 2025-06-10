/**
 * Creates a Map from an array of objects using a specified attribute as the key.
 * @template T - Type of object
 * @param data - Array of objects to be mapped
 * @param keyAttr - The attribute name to use as key (default: 'id')
 * @returns Map with the specified attribute values as keys and corresponding objects as values
 *
 * @example
 * ```ts
 * const userMap = buildDataMapByAttribute(users, 'id');
 * const emailMap = buildDataMapByAttribute(users, 'email');
 * ```
 */
export const buildDataMapByAttribute = <T extends Record<string, any>>(
  data: T[],
  keyAttr: keyof T = 'id'
): Map<string, T> => {
  return new Map(data.map((item) => [String(item[keyAttr]), item]));
};
