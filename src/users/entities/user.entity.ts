import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column()
  @ApiProperty()
  balance: number;

  @Column()
  @ApiProperty()
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @Column()
  @ApiProperty()
  updatedAt?: Date;
}
