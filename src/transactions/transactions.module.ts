import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevokedToken } from 'src/auth/entities/revoked-token.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Transaction, RevokedToken])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
