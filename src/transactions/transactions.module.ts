import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevokedToken } from 'src/auth/entities/revoked-token.entity';
import { Transaction } from './entities/transaction.entity';
import { UsersModule } from 'src/users/users.module';
import { LoggersModule } from 'src/loggers/logger.module';

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([Transaction, RevokedToken]), LoggersModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
