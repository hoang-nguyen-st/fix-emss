import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

export abstract class AbstractEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  @Exclude()
  createdAt: Date;

  @Column({ type: 'varchar', nullable: true, name: 'created_by' })
  @Exclude()
  createdBy: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  @Exclude()
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true, name: 'updated_by' })
  @Exclude()
  updatedBy: string;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    name: 'deleted_at',
  })
  @Exclude()
  deletedAt: Date;

  @Column({ type: 'varchar', nullable: true, name: 'deleted_by' })
  @Exclude()
  deletedBy: string;
}
