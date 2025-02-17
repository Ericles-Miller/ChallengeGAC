import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { format, toZonedTime } from 'date-fns-tz';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @CreateDateColumn({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty()
  @Transform(({ value }) => {
    const timeZone = 'America/Sao_Paulo';
    const zonedDate = toZonedTime(value, timeZone);
    return format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone });
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp', nullable: true })
  @Transform(({ value }) => {
    if (value) {
      const timeZone = 'America/Sao_Paulo';
      const zonedDate = toZonedTime(value, timeZone);
      return format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone });
    }
  })
  updatedAt?: Date;

  setUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}
