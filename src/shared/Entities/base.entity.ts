import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @CreateDateColumn({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp', nullable: true })
  updatedAt?: Date;

  setUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}
