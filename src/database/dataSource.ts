import { User } from 'src/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { Logger } from 'src/loggers/entities/logger.entity';
import { RevokedToken } from 'src/auth/entities/revoked-token.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionReversal } from 'src/transactions/entities/transaction-reversal.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
  synchronize: false,
  entities: [User, Logger, RevokedToken, Transaction, TransactionReversal],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsRun: true,
  logging: process.env.NODE_ENV === 'development' ? true : false,
};

const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });

export default dataSource;
