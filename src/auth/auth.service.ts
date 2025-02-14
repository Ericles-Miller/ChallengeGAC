import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenAccessResponseDto } from './dto/token-acess-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { compare } from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.Dto';
import 'dotenv/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginUserDto): Promise<TokenAccessResponseDto> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) throw new BadRequestException('email or password incorrect');

      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) throw new BadRequestException('email or password incorrect');

      return await this.createSession(user);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Unexpected server error to login');
    }
  }

  private async createSession(user: User): Promise<TokenAccessResponseDto> {
    try {
      const payload = {
        userId: user.id,
        email: user.email,
        username: user.name,
      };

      const refreshToken = this.jwtService.sign(
        { email: user.email },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: '7h',
        },
      );

      const token = this.jwtService.sign(payload);

      await this.usersRepository.update(user.id, {
        refreshTokenCode: refreshToken,
        updatedAt: new Date(),
        lastLogin: new Date(),
      });

      return {
        token,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Unexpected server error to create session');
    }
  }

  async refreshToken({ refreshTokenCode }: RefreshTokenDto): Promise<TokenAccessResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshTokenCode, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      const user = await this.usersRepository.findOne({
        where: { email: payload.email, refreshTokenCode },
      });

      if (!user) {
        throw new UnauthorizedException('Unauthorized access');
      }

      return await this.createSession(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException('Unexpected server error to refresh token');
    }
  }

  async logout(refreshTokenCode: string): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({ where: { refreshTokenCode } });
      if (!user) throw new BadRequestException('Invalid refresh token');

      user.refreshTokenCode = null;

      await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException('Uneexpected server error to logout');
    }
  }

  validateUser(userId: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }
}
