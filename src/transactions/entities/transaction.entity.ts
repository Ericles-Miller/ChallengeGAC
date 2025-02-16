import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/shared/Entities/base.entity';
import { EStatusTransactions } from '../status-transaction.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TransactionReversal } from './transaction-reversal.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'uuid' })
  senderId: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  receiverId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty()
  amount: number;

  @ApiProperty()
  @Column()
  status: EStatusTransactions;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  code: string;

  @OneToMany(() => TransactionReversal, (transactionReversal) => transactionReversal.transaction, {
    cascade: true,
  })
  transactionReversals?: TransactionReversal[];

  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'senderId' })
  user: User;

  constructor(amount: number, receiverId: string, senderId: string, status: EStatusTransactions) {
    super();
    this.amount = amount;
    this.receiverId = receiverId;
    this.senderId = senderId;
    this.status = status;
    this.setCode();
  }

  setStatus(status: EStatusTransactions): void {
    this.status = status;
    this.setUpdatedAt();
  }

  setCode(): void {
    const chars = process.env.CHAR_CODE;
    let code = '';

    for (let i = 0; i <= 50; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }

    this.code = code;
  }
}
