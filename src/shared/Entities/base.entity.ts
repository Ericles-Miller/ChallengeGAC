import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt?: Date;

  constructor() {}

  setUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}
