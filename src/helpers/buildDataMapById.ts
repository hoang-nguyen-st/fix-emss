export const buildDataMapById = <T extends { id?: string; userId?: string }>(data: T[]): Map<string, T> => {
  return new Map(data.map((u) => [u.id || u.userId, u]));
};
