import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { format } from 'date-fns-tz';
import { subHours, addHours } from 'date-fns';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @CreateDateColumn({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
  })
  @ApiProperty()
  @Transform(({ value }) => {
    return format(subHours(value, 3), 'yyyy-MM-dd HH:mm:ssXXX');
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp', nullable: true })
  @Transform(({ value }) => {
    if (value) {
      return format(subHours(value, 3), 'yyyy-MM-dd HH:mm:ssXXX');
    }
  })
  updatedAt?: Date;

  setUpdatedAt(): void {
    this.updatedAt = addHours(new Date(), 3);
  }
}
