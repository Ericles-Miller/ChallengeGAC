import { User } from 'src/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { RevokedToken } from 'src/auth/entities/revoked-token.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
  synchronize: false,
  entities: [User, RevokedToken],
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
