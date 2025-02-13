import { ApiProperty } from '@nestjs/swagger';
import { BaseIsActive } from 'src/shared/Entities/BaseIsActive';
import { Column, Entity } from 'typeorm';
import { hash } from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseIsActive {
  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @ApiProperty()
  email: string;

  @Column({ type: 'varchar', length: 40 })
  @ApiProperty()
  @Exclude()
  password: string;

  @Column({ type: 'float' })
  @ApiProperty()
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
