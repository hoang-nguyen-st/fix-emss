/**
 * Classifies differences between external and database data into categories for persistence.
 *
 * @template TExternal - Type of external data
 * @template TEntity - Type of entity data
 *
 * @param externalMap - Map<string, TExternal> representing the latest external data
 * @param dbMap - Map<string, TEntity> representing current database state
 * @param isChanged - Function that checks if an entity needs to be updated
 * @param mapToEntity - Async function that maps external data to partial entity fields
 * @param createEntity - Function to create a new entity instance from mapped data
 *
 * @returns An object containing:
 *   - `toAddOrUpdate`: List of entities to create or update
 *   - `toDelete`: List of string keys for entities that should be deleted
 *
 * @example
 * ```typescript
 * const { toAddOrUpdate, toDelete } = await classifyMapDifferences(
 *   externalUserMap,
 *   dbUserMap,
 *   (user, external) => user.email !== external.email,
 *   async (external) => ({ email: external.email }),
 *   (data) => new UserEntity(data)
 * );
 * ```
 */
export async function classifyMapDifferences<TExternal, TEntity>(
  externalMap: Map<string, TExternal>,
  dbMap: Map<string, TEntity>,
  isChanged: (entity: TEntity, external: TExternal) => boolean,
  mapToEntity: (external: TExternal) => Promise<Partial<TEntity>>,
  createEntity: (data: Partial<TEntity>) => TEntity
): Promise<{
  toAddOrUpdate: TEntity[];
  toDelete: string[];
}> {
  const toAddOrUpdate: TEntity[] = [];
  const toDelete: string[] = [];

  for (const [key, external] of externalMap.entries()) {
    const existing = dbMap.get(key);

    if (!existing) {
      const newData = await mapToEntity(external);
      toAddOrUpdate.push(createEntity(newData));
    } else {
      if (isChanged(existing, external)) {
        const updated = await mapToEntity(external);
        Object.assign(existing, updated);
        toAddOrUpdate.push(existing);
      }
      dbMap.delete(key);
    }
  }

  for (const [key] of dbMap.entries()) {
    toDelete.push(key);
  }

  return { toAddOrUpdate, toDelete };
}
