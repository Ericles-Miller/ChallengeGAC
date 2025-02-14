import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { TokenAccessDto } from './dto/token-access.dto';
import { RefreshTokenDto } from './dto/refresh-token.Dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: `
    Login user to generate accessToken and RefreshToken
    sample request:
    POST /auth/login
    {
      "email": "6u0aM@example.com",
      "password": "123456"
    }
    `,
  })
  @ApiResponse({
    status: 201,
    type: TokenAccessDto,
    description: `create refresh token successfully`,
  })
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
  @ApiOperation({
    summary: 'Refresh token',
    description: `
    Refresh token to generate accessToken and RefreshToken
    sample request:
    POST /auth/refresh
    {
      "refreshToken": "refreshToken"
    }
    `,
  })
  @ApiResponse({
    status: 201,
    type: TokenAccessDto,
    description: `create refresh token successfully`,
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
  @ApiOperation({
    summary: 'Logout user',
    description: `
    Logout user
    sample request:
    POST /auth/logout
    {
      "tokenAccess": "tokenAccess",
      "refreshToken": "refreshToken"
    }
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'logout user successfully',
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
