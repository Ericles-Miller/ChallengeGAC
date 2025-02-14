import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/dataSource';
import { LoggersModule } from './loggers/loggers.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule, LoggersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
