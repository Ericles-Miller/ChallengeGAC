import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/dataSource';
import { LoggersModule } from './loggers/logger.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationOptions: { abortEarly: false },
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    LoggersModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {}
}
