/**
 * Creates a Map from an array of objects using their 'id' property as the key
 * @template T - Type of object that has an id property
 * @param data - Array of objects to be mapped
 * @returns Map with id as keys and corresponding objects as values
 *
 * @example
 * ```typescript
 * const userMap = buildDataMapById(users); // users: { id: string, ... }[]
 * ```
 */
export const buildDataMapById = <T extends { id: string }>(data: T[]): Map<string, T> => {
  return new Map(data.map((u) => [u.id, u]));
};
