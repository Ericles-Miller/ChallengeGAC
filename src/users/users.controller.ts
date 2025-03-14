import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { PaginatedListDto } from 'src/shared/Dtos/PaginatedList.dto';
import { JwtAuthGuard } from 'src/auth/Jwt-auth-guard';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Create new user',
    description: `
    sample request: 
    POST /users
    REQUEST BODY:
    {
      "name": "name movie",
      "email": "email@example.com",
      "password": "********",
      "balance": 0.0
    }
    `,
  })
  @Throttle({ default: { limit: 1000, ttl: 60000 } })
  @ApiResponse({
    status: 201,
    type: User,
    description: 'Create user successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Number to page',
    example: '1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items to page',
    example: '10',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'name of user',
    example: 'John Doe',
  })
  @ApiOperation({
    summary: 'Find all users. This endpoint is used to help the user find other users in the API',
    description: `
    sample request: find users paginated default and by name of user
    Get /users?page=1&limit=10&name=John

    sample request: find users paginated not default by name of user
    Get /users?page=3&limit=5&name=John

    sample request: find users not paginated default
    Get /users?page=1&limit=10

    sample request: find user not paginated default 
    Get /users?page=1&limit=10
    `,
  })
  @ApiResponse({
    status: 200,
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedListDto<User[]>) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(User) },
            },
          },
        },
      ],
    },
    description: 'Find all users with filters successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests',
  })
  @ApiExtraModels(PaginatedListDto, User)
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
  ): Promise<PaginatedListDto<User[]>> {
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = Number(limit) > 0 ? Number(limit) : 10;

    return await this.usersService.findAll(pageNumber, limitNumber, name);
  }

  @Get('/find-your-user')
  @ApiBearerAuth('sessionAuth')
  @Throttle({ default: { limit: 20, ttl: 10000 } })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Find info of user',
    description: `
    sample request: find user with id
    Get /user/find-your-user
    `,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 200,
    type: User,
    description: 'Find user successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests',
  })
  async findOne(@Req() request: Request): Promise<User> {
    const { userId } = request.user;
    return await this.usersService.findOne(userId);
  }

  @Patch('')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 6, ttl: 6000 } })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({
    type: UpdateUserDto,
    required: true,
  })
  @ApiOperation({
    summary: 'Update user',
    description: `
    sample request: update all properties user. Obs: All of properties are optionals
    PATCH /users/
    REQUEST BODY: 
    {
      "name": "John Doe",
      "password": "********",
      "isActive": true,
      "balance": 5000,
    }
    `,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 204,
    description: 'update user successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests',
  })
  @HttpCode(204)
  async update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    const { userId } = request.user;
    await this.usersService.update(userId, updateUserDto);
  }

  @Delete('')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 6, ttl: 6000 } })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Delete user',
    description: `
    sample request: delete user 
    DELETE /users/
    `,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 204,
    description: 'delete user successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests',
  })
  @HttpCode(204)
  async remove(@Req() request: Request): Promise<void> {
    const { userId } = request.user;
    await this.usersService.remove(userId);
  }
}
