import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { BadRequestException } from '@nestjs/common';
import { BaseEntity } from 'src/shared/Entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @ApiProperty()
  email: string;

  @Column({ type: 'varchar', length: 300 })
  @ApiProperty()
  @Exclude()
  password: string;

  @Column({ type: 'float' })
  @ApiProperty()
  balance: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty()
  @Exclude()
  refreshTokenCode?: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

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

  private activate(): void {
    if (this.isActive) throw new BadRequestException('Is already active.');

    this.isActive = true;
  }

  private deactivate(): void {
    if (!this.isActive) throw new BadRequestException('Is already inactive.');

    this.isActive = false;
  }

  setIsActive(status: boolean): void {
    status ? this.activate() : this.deactivate();

    this.setUpdatedAt();
  }
}
