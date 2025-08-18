import { Expose } from 'class-transformer';

export class WorkspaceDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
