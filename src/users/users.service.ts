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

      const user = new User(balance, email, name, password);

      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Unexpected server error to create a new user');
    }
  }

  async findAll(page: number, limit: number, name?: string): Promise<PaginatedListDto<User[]>> {
    try {
      const queryBuilder = this.usersRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.name', 'user.email', 'user.isActive', 'user.createdAt', 'user.updatedAt']);

      if (name) {
        queryBuilder.where('unaccent(user.name) ILIKE unaccent(:name)', {
          name: `%${name}%`,
        });
      }

      const [users, total] = await queryBuilder
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount();

      return {
        data: users,
        total,
        page,
        limit: Math.ceil(total / limit),
      };
    } catch {
      throw new InternalServerErrorException('Internal server error finding users');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('UserId does not exists');

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Internal server error to find user');
    }
  }

  async update(id: string, { balance, name, password, isActive }: UpdateUserDto): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('UserId does not exist');

      if (name !== undefined) user.name = name;
      if (balance !== undefined) user.balance = balance;
      if (password !== undefined) user.password = password;
      if (isActive !== undefined) user.setIsActive(isActive);

      user.setUpdatedAt();

      await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Internal server error to update user');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('UserId does not exists');

      await this.usersRepository.delete(id);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Internal server error to delete user');
    }
  }
}
