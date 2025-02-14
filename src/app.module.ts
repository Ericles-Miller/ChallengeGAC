import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/dataSource';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationOptions: { abortEarly: false },
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    this.checkEnv();
  }

  private checkEnv() {
    const requiredEnvVars = [
      'JWT_TOKEN_SECRET',
      'NODE_ENV',
      'JWT_REFRESH_TOKEN_SECRET',
      'DATABASE_HOST',
      'DATABASE_USERNAME',
      'DATABASE_PASSWORD',
      'DATABASE_NAME',
      'DATABASE_PORT',
      'PORT',
    ];

    requiredEnvVars.forEach((key) => {
      if (!process.env[key]) {
        console.warn(`⚠️  A variável de ambiente "${key}" NÃO está definida.`);
      } else {
        console.log(`✅ ${key} carregado com sucesso.`);
      }
    });

    console.log('\n✅ Verificação concluída!');
  }
}
