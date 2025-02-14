import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { TokenAccessDto } from './dto/token-acess.dto';
import { RefreshTokenDto } from './dto/refresh-token.Dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 400,
    description: 'bad request to send data',
  })
  async login(@Body() loginUserDto: LoginUserDto): Promise<TokenAccessDto> {
    return await this.authService.login(loginUserDto);
  }

  @Post('refresh')
  @ApiResponse({
    status: 201,
    type: TokenAccessDto,
    description: 'create refresh token successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 400,
    description: 'bad request to send data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenAccessDto> {
    return await this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @ApiResponse({
    status: 200,
    description: 'Create user successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 400,
    description: 'bad request to send data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async logout(@Body() tokenAccessDto: TokenAccessDto): Promise<void> {
    await this.authService.logout(tokenAccessDto);
  }
}
