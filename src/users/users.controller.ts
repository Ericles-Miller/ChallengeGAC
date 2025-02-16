import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { PaginatedListDto } from 'src/shared/Dtos/PaginatedList.dto';
import { JwtAuthGuard } from 'src/auth/Jwt-auth-guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'create new user',
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
    description: 'bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOperation({
    summary: 'find all users',
    description: `
    This endpoint is used to help the user find other users in the API
    sample request: find users paginated default
    Get /users?page=1&limit=10

    sample request: find users paginated not default
    Get /users?page=3&limit=5
    `,
  })
  @ApiResponse({
    status: 200,
    type: PaginatedListDto<User[]>,
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
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedListDto<User[]>> {
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = Number(limit) > 0 ? Number(limit) : 10;

    return await this.usersService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'find users with id',
    description: `
    sample request: find user with id
    Get /user/8abcb8a5-9709-41c7-85df-08a44fd1c6f4
    `,
  })
  @ApiResponse({
    status: 404,
    description: 'not found',
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
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({
    type: UpdateUserDto,
    required: true,
  })
  @ApiOperation({
    summary: 'Update user',
    description: `
    sample request: update all properties user. Obs: All of properties are optionals
    PATCH /users/8abcb8a5-9709-41c7-85df-08a44fd1c6f4/
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
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Delete user',
    description: `
    sample request: delete user 
    DELETE /users/8abcb8a5-9709-41c7-85df-08a44fd1c6f4/
    `,
  })
  @ApiResponse({
    status: 404,
    description: 'userId does not exists',
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
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.usersService.remove(id);
  }
}
