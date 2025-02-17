import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Transaction } from './transaction.entity';
import { BaseEntity } from 'src/shared/Entities/base.entity';

@Entity('transactionsReversals')
export class TransactionReversal extends BaseEntity {
  @Column({ type: 'uuid' })
  @ApiProperty()
  transactionId: string;

  @Column({ type: 'varchar', length: 250 })
  @ApiProperty()
  reason: string;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty()
  reversedAt: Date;

  @ManyToOne(() => Transaction, (transaction) => transaction.transactionReversals, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @Column({ type: 'float' })
  amount: number;

  constructor(transactionId: string, reason: string, amount: number) {
    super();
    this.transactionId = transactionId;
    this.reason = reason;
    this.amount = amount;
    this.reversedAt = new Date();
  }
}
