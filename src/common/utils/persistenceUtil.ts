import { UpdateResult } from 'typeorm';

/**
 * Type representing an entity that has an id property
 */
type EntityWithId = { id: string };

/**
 * Persists changes to entities by saving new/updated entities and soft deleting removed ones
 * @template TEntity - Type of entity that extends EntityWithId
 * @param repository - Repository object with save and softDelete methods
 * @param toSave - Array of entities to be saved or updated
 * @param toDelete - Array of entity IDs to be soft deleted
 * @returns Promise that resolves when all changes are persisted
 *
 * @example
 * ```typescript
 * await persistEntityChanges(userRepository, usersToUpdate, userIdsToDelete);
 * ```
 */
export async function persistEntityChanges<TEntity extends EntityWithId>(
  repository: {
    save: (entities: TEntity[]) => Promise<TEntity[]>;
    softDelete: (ids: string[]) => Promise<UpdateResult>;
  },
  toSave: TEntity[],
  toDelete: string[]
): Promise<void> {
  if (toSave.length > 0) {
    await repository.save(toSave);
  }

  if (toDelete.length > 0) {
    await repository.softDelete(toDelete);
  }
}
