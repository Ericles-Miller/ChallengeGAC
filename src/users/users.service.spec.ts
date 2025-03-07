import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

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
            delete: jest.fn(),
            createQueryBuilder: jest.fn(),
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

  describe('Suit test to find all users', () => {
    it('should find all users', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([[user], 1]),
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: [user],
        total: 1,
        page: 1,
        limit: 1,
      });

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should find all users with name filter', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([[user], 1]),
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll(1, 10, 'John');

      expect(result).toEqual({
        data: [user],
        total: 1,
        page: 1,
        limit: 1,
      });

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('unaccent(user.name) ILIKE unaccent(:name)', {
        name: '%John%',
      });
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should throw a InternalServerErrorException if unexpected error occurs', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockRejectedValueOnce(new Error()),
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      await expect(service.findAll(1, 10)).rejects.toThrow(InternalServerErrorException);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });
  });

  describe('Suit test to find one user', () => {
    it('should find one user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      const result = await service.findOne('9b815039-1e43-4be1-84ef-71e5fad13373');
      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne('9b815039-1e43-4be1-84ef-71e5fad13373')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a InternalServerErrorException if unexpected error occurs', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());
      await expect(service.findOne('9b815039-1e43-4be1-84ef-71e5fad13373')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('Suit test to delete a user', () => {
    it('should delete a user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'delete');

      await service.remove('9b815039-1e43-4be1-84ef-71e5fad13373');

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.remove('9b815039-1e43-4be1-84ef-71e5fad13373')).rejects.toThrow(NotFoundException);
    });

    it('should throw a InternalServerErrorException if unexpected error occurs', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());
      await expect(service.remove('9b815039-1e43-4be1-84ef-71e5fad13373')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('Suit test to update a user', () => {
    it('should update a user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'save');

      await service.update('9b815039-1e43-4be1-84ef-71e5fad13373', {
        name: 'John Doe Updated',
      });

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(
        service.update('9b815039-1e43-4be1-84ef-71e5fad13373', {
          name: 'John Doe Updated',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw a BadRequestException if isActive is already set to the same value', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      await expect(
        service.update('9b815039-1e43-4be1-84ef-71e5fad13373', {
          isActive: user.isActive,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a InternalServerErrorException if unexpected error occurs', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());
      await expect(
        service.update('9b815039-1e43-4be1-84ef-71e5fad13373', {
          name: 'John Doe Updated',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
