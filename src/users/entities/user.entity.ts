import { ApiProperty } from '@nestjs/swagger';
import { BaseIsActive } from 'src/shared/Entities/BaseIsActive';
import { Column, Entity } from 'typeorm';
import { hash } from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends BaseIsActive {
  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  @Exclude()
  password: string;

  @Column()
  @ApiProperty()
  @Exclude()
  balance: number;

  constructor(balance: number, email: string, name: string) {
    super();
    this.balance = balance;
    this.email = email;
    this.name = name;
    this.isActive = true;
  }

  async setPassword(password: string): Promise<void> {
    const passwordHash = await hash(password, 8);
    this.password = passwordHash;
  }
}
