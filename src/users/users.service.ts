import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedListDto } from 'src/shared/Dtos/PaginatedList.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async create({ balance, email, name, password }: CreateUserDto): Promise<User> {
    try {
      const findUser = await this.usersRepository.findOne({ where: { email } });
      if (findUser) throw new BadRequestException('User already exists');

      const user = new User(balance, email, name);
      await user.setPassword(password);

      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Unexpected server error to create a new user');
    }
  }

  async findAll(page: number, limit: number): Promise<PaginatedListDto<User[]>> {
    try {
      const [users, total] = await this.usersRepository.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        data: users,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch {
      throw new InternalServerErrorException('Internal server error finding movies');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('UserId does not exists');

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Unexpected server error to find user');
    }
  }

  async update(id: string, { balance, name, password, isActive }: UpdateUserDto): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('UserId does not exists');

      user.name = name;
      user.balance = balance;
      user.setPassword(password);
      user.setUpdatedAt();

      if (isActive !== undefined) user.setIsActive(isActive);

      await this.usersRepository.update(id, user);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Unexpected server error to update user');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('UserId does not exists');

      if (user.balance > 0) throw new BadRequestException('User has a balance');

      await this.usersRepository.delete(id);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Unexpected server error to delete user');
    }
  }
}
