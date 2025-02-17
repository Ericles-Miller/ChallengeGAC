import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from '../users/entities/user.entity';
import { EStatusTransactions } from './status-transaction.enum';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionReversal } from './entities/transaction-reversal.entity';
import { CreateTransactionReversalDto } from './dto/create-transaction-reversal.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });
describe('TransactionsService', () => {
  let service: TransactionsService;
  let dataSource: DataSource;
  let transactionRepository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              manager: {
                findOne: jest.fn(),
                save: jest.fn(),
              },
            }),
          },
        },
        {
          provide: 'TransactionRepository',
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              innerJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    dataSource = module.get<DataSource>(DataSource);
    transactionRepository = module.get<Repository<Transaction>>('TransactionRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(dataSource).toBeDefined();
    expect(transactionRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction successfully', async () => {
      const senderId = '9b815039-1e43-4be1-84ef-71e5fad13373';
      const receiverId = '38c2233d-93d5-4230-bb52-c5e87301011a';
      const createTransactionDto: CreateTransactionDto = { amount: 100, receiverId };

      const sender = new User(2000, 'sender@email.com', 'senderName', 'password');
      sender.id = senderId;

      const receiver = new User(4000, 'receiver@email.com', 'receiverName', 'password');
      receiver.id = receiverId;

      const transaction = new Transaction(100, receiverId, senderId, EStatusTransactions.pending);

      const queryRunner = dataSource.createQueryRunner();
      jest
        .spyOn(queryRunner.manager, 'findOne')
        .mockResolvedValueOnce({ id: senderId, ...sender })
        .mockResolvedValueOnce({ id: receiverId, ...receiver });

      jest.spyOn(queryRunner.manager, 'save').mockResolvedValueOnce(transaction);

      const result = await service.create(senderId, createTransactionDto);

      expect(result).toEqual(transaction);
      expect(queryRunner.manager.findOne).toHaveBeenCalledTimes(2);
      expect(queryRunner.manager.save).toHaveBeenCalledTimes(4);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if sender does not exist', async () => {
      const senderId = '9b815039-1e43-4be1-84ef-71e5fad13373';
      const receiverId = '38c2233d-93d5-4230-bb52-c5e87301011a';
      const createTransactionDto: CreateTransactionDto = { amount: 100, receiverId };

      const queryRunner = dataSource.createQueryRunner();
      jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValueOnce(null);

      await expect(service.create(senderId, createTransactionDto)).rejects.toThrow(NotFoundException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException if sender has insufficient balance', async () => {
      const senderId = '9b815039-1e43-4be1-84ef-71e5fad13373';
      const receiverId = '38c2233d-93d5-4230-bb52-c5e87301011a';
      const createTransactionDto: CreateTransactionDto = { amount: 100, receiverId };

      const sender = new User(50, 'sender@email.com', 'senderName', 'password');

      const queryRunner = dataSource.createQueryRunner();
      jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValueOnce(sender);

      await expect(service.create(senderId, createTransactionDto)).rejects.toThrow(BadRequestException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of transactions', async () => {
      const senderId = 'sender-id';
      const page = 1;
      const limit = 10;
      const receiverName = 'receiver';

      const transactions = [new Transaction(100, 'receiver-id', senderId, EStatusTransactions.completed)];
      const total = 1;

      jest.spyOn(transactionRepository, 'createQueryBuilder').mockReturnValue({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([transactions, total]),
      } as any);

      const result = await service.findAll(page, limit, senderId, receiverName);

      expect(result).toEqual({ data: transactions, total, page, limit });
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      const senderId = '38c2233d-93d5-4230-bb52-c5e87301011a';
      const transaction = new Transaction(
        100,
        senderId,
        'f66dc758-5fad-41a3-9d3d-136deeb0e28e',
        EStatusTransactions.completed,
      );

      jest.spyOn(transactionRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(transaction),
      } as any);

      const result = await service.findOne(transaction.id, senderId);

      expect(result).toEqual(transaction);
    });

    it('should throw NotFoundException if transaction does not exist', async () => {
      const id = 'transaction-id';
      const senderId = '38c2233d-93d5-4230-bb52-c5e87301011a';

      jest.spyOn(transactionRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.findOne(id, senderId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('reversal', () => {
    it('should reverse a transaction successfully', async () => {
      const senderId = '9b815039-1e43-4be1-84ef-71e5fad13373';
      const receiverId = '38c2233d-93d5-4230-bb52-c5e87301011a';

      const sender = new User(2000, 'sender@email.com', 'senderName', 'password');
      sender.id = senderId;

      const transaction = new Transaction(100, receiverId, senderId, EStatusTransactions.completed);
      const createTransactionReversalDto: CreateTransactionReversalDto = {
        code: transaction.code,
        reason: 'reason',
      };

      const receiver = new User(4000, 'receiver@email.com', 'receiverName', 'password');
      receiver.id = receiverId;

      const transactionReversal = new TransactionReversal(transaction.id, 'reason', 100);

      const queryRunner = dataSource.createQueryRunner();
      jest
        .spyOn(queryRunner.manager, 'findOne')
        .mockResolvedValueOnce(transaction)
        .mockResolvedValueOnce({ id: senderId, ...sender })
        .mockResolvedValueOnce({ id: receiverId, ...receiver });

      jest.spyOn(queryRunner.manager, 'save').mockResolvedValueOnce(transactionReversal);

      const result = await service.reversal(receiverId, createTransactionReversalDto);

      expect(result.amount).toEqual(transactionReversal.amount);
      expect(result.reason).toEqual(transactionReversal.reason);
      expect(result.transactionId).toEqual(transactionReversal.transactionId);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if transaction does not exist', async () => {
      const receiverId = 'receiver-id';
      const createTransactionReversalDto: CreateTransactionReversalDto = { code: 'code', reason: 'reason' };

      const queryRunner = dataSource.createQueryRunner();
      jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValueOnce(null);

      await expect(service.reversal(receiverId, createTransactionReversalDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
