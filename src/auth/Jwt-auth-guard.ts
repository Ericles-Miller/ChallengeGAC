import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RevokedToken } from './entities/revoked-token.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(RevokedToken)
    private readonly revokedTokenRepository: Repository<RevokedToken>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token || !(await this.isTokenValid(token))) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private async isTokenValid(token: string): Promise<boolean> {
    const isRevoked = await this.revokedTokenRepository.findOne({ where: { token } });
    if (isRevoked) return false;

    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_TOKEN_SECRET });
      return !!decoded;
    } catch {
      return false;
    }
  }
}
