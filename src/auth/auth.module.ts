import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthController } from './auth.controller';
import * as dotenv from 'dotenv';
import { RevokedToken } from './entities/revoked-token.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RevokedToken]),
    JwtModule.register({
      secret: process.env.JWT_TOKEN_SECRET,
      signOptions: { expiresIn: '2min' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
