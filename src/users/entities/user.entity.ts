import { ApiProperty } from '@nestjs/swagger';
import { BaseIsActive } from 'src/shared/Entities/BaseIsActive';
import { Column, Entity, OneToMany } from 'typeorm';
import { hash } from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { Transaction } from 'src/transactions/entities/transaction.entity';

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

  @Column({ type: 'float', default: 0 })
  @ApiProperty()
  balance: number;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  @Exclude()
  refreshTokenCode: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user, { cascade: true })
  transactions: Transaction[];

  constructor(balance: number, email: string, name: string) {
    super();
    this.balance = balance ?? 0;
    this.email = email;
    this.name = name;
    this.isActive = true;
  }

  async setPassword(password: string): Promise<void> {
    // remover
    const passwordHash = await hash(password, 8);
    this.password = passwordHash;
  }
}
