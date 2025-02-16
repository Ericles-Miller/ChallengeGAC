import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ELoggerLevel } from '../logger-level.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('logs')
export class Logger {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  method: string;

  @Column()
  @ApiProperty()
  url: string;

  @Column()
  @ApiProperty()
  statusCode: number;

  @Column({ default: Date.now })
  timestamp: Date;

  @Column()
  @ApiProperty()
  ip: string;

  @Column()
  @ApiProperty()
  level: ELoggerLevel;

  @Column()
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
