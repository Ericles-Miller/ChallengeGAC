import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt?: Date;

  constructor() {}

  setUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}
