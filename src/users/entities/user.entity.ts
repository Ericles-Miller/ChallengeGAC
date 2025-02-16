import { ApiProperty } from '@nestjs/swagger';
import { BaseIsActive } from 'src/shared/Entities/BaseIsActive';
import { Column, Entity, OneToMany } from 'typeorm';
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

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty()
  @Exclude()
  refreshTokenCode?: string;

  @OneToMany(() => Transaction, (transaction) => transaction.sender, { cascade: true })
  sendTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.receiver)
  receivedTransactions: Transaction[];

  constructor(balance: number, email: string, name: string, password: string) {
    super();
    this.balance = balance;
    this.password = password;
    this.email = email;
    this.name = name;
    this.isActive = true;
  }
}
