import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ELoggerLevel } from '../logger-level.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { format, toZonedTime } from 'date-fns-tz';

@Entity('logs')
export class Logger {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'varchar', length: 25 })
  @ApiProperty()
  method: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty()
  url: string;

  @Column({ type: 'int' })
  @ApiProperty()
  statusCode: number;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Transform(({ value }) => {
    const timeZone = 'America/Sao_Paulo';
    const zonedDate = toZonedTime(value, timeZone);
    return format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone });
  })
  timestamp: Date;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty()
  ip: string;

  @Column({ type: 'varchar' })
  @ApiProperty()
  level: ELoggerLevel;

  @Column({ type: 'int' })
  @ApiProperty()
  timeRequest: number;

  constructor(
    method: string,
    url: string,
    statusCode: number,
    level: ELoggerLevel,
    ip: string,
    timeRequest: number,
  ) {
    this.method = method;
    this.url = url;
    this.level = level;
    this.ip = ip;
    this.timeRequest = timeRequest;
    this.statusCode = statusCode;
  }
}
