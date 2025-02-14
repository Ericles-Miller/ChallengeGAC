import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/shared/Entities/base.entity';
import { EStatusTransactions } from '../status-transaction.enum';
import { Column } from 'typeorm';

export class Transaction extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  senderId: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  receiverId: string;

  @ApiProperty()
  @Column({ type: 'float' })
  amount: number;

  @ApiProperty()
  @Column()
  status: EStatusTransactions;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  code: string;

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
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i <= 50; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }

    this.code = code;
  }
}
