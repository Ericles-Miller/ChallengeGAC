import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const user = new User(
    100,
    'test@test.com',
    'John Doe',
    '$2a$08$WBrratiQFGKpw8EySozjv.pq5JsNY2PcnnULRSwSNP/UOWBK9vkH6',
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('Suit test to create a new user', () => {
    it('should create a new user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(user);

      const result = await service.create({
        balance: 100,
        email: 'test@test.com',
        name: 'John Doe',
        password: 'password',
      });

      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw a BadRequestException if user already exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      await expect(
        service.create({
          balance: 100,
          email: 'test@test.com',
          name: 'John Doe',
          password: 'password',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a InternalServerErrorException if unexpected error occurs', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());

      await expect(
        service.create({
          balance: 100,
          email: 'test@test.com',
          name: 'John Doe',
          password: 'password',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
