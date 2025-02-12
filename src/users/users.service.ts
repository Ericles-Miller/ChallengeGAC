import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor() {}

  async create(createUserDto: CreateUserDto): Promise<User> {}

  async findAll(): Promise<User[]> {
    return `This action returns all users`;
  }

  async findOne(id: number): Promise<User> {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    return `This action updates a #${id} user`;
  }

  async remove(id: number): Promise<void> {
    return `This action removes a #${id} user`;
  }
}
