import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { RevokedToken } from 'src/auth/entities/revoked-token.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/Jwt-auth-guard';
import { ExecutionContext } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';
import { TransactionReversal } from './entities/transaction-reversal.entity';
import { JwtModule } from '@nestjs/jwt';
import { Transaction } from './entities/transaction.entity';
import { UsersService } from 'src/users/users.service';
import { UsersController } from 'src/users/users.controller';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionReversalDto } from './dto/create-transaction-reversal.dto';
import { LoggersModule } from 'src/loggers/logger.module';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;
  let usersService: UsersService;
  let userController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController, UsersController],
      providers: [
        TransactionsService,
        UsersService,
        {
          provide: getRepositoryToken(RevokedToken),
          useClass: Repository,
        },
        {
          provide: JwtAuthGuard,
          useValue: {
            canActivate: (context: ExecutionContext) => {
              const request = context.switchToHttp().getRequest();
              request.user = {
                userId: '9b815039-1e43-4be1-84ef-71e5fad13373',
                email: 'authuser@example.com',
              };
              return true;
            },
          },
        },
      ],
      imports: [
        AuthModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, RevokedToken, Transaction, TransactionReversal],
          synchronize: true,
        }),
        LoggersModule,
        TypeOrmModule.forFeature([Transaction, RevokedToken, User]),
        JwtModule.register({
          secret: 'dc57f9ec-c6b2-477f-a6af-fc57c1b86be0',
          signOptions: { expiresIn: '1h' },
        }),
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
    userController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
    expect(userController).toBeDefined();
  });

  describe('Suit test to create a new transaction - Integration Test', () => {
    it('should create a new transaction', async () => {
      const user = await userController.create({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
        balance: 5000,
      });

      const user2 = await userController.create({
        email: 'test2@example.com',
        password: 'password',
        name: 'Test User',
        balance: 5000,
      });

      const createTransactionDto = {
        amount: 100,
        receiverId: user2.id,
      };

      const result = await controller.create(createTransactionDto, {
        user: {
          userId: user.id,
          email: 'authuser@example.com',
        },
      } as any);

      expect(result).toBeDefined();
      expect(result.amount).toEqual(createTransactionDto.amount);
      expect(result.receiverId).toEqual(createTransactionDto.receiverId);
    });
  });

  it('should return a list of transactions', async () => {
    const user = await userController.create({
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      balance: 5000,
    });

    const user2 = await userController.create({
      email: 'test2@example.com',
      password: 'password',
      name: 'Test User',
      balance: 5000,
    });

    const createTransactionDto: CreateTransactionDto = {
      amount: 100,
      receiverId: user2.id,
    };

    const transaction = await controller.create(createTransactionDto, {
      user: {
        userId: user.id,
        email: 'test@example.com',
      },
    } as any);

    const transaction2 = await controller.create(createTransactionDto, {
      user: {
        userId: user.id,
        email: 'test@example.com',
      },
    } as any);

    const transactions = await controller.findAll(
      {
        user: {
          userId: user.id,
          email: 'authuser@example.com',
        },
      } as any,
      '1',
      '10',
    );

    expect(transactions).toBeDefined();
    expect(transactions.data).toHaveLength(2);

    expect(transactions.data[0].amount).toEqual(transaction.amount);
    expect(transactions.data[0].status).toEqual(transaction.status);

    expect(transactions.data[1].amount).toEqual(transaction2.amount);
    expect(transactions.data[1].status).toEqual(transaction2.status);
  });

  it('should return a single transaction', async () => {
    const user = await userController.create({
      email: 'test@example.com',
      password: '@1Wsd01q',
      name: 'Test User',
      balance: 5000,
    });

    const user2 = await userController.create({
      email: 'test2@example.com',
      password: '@1Wsd01q',
      name: 'Test User',
      balance: 5000,
    });

    const createTransactionDto: CreateTransactionDto = {
      amount: 100,
      receiverId: user2.id,
    };

    const transaction = await controller.create(createTransactionDto, {
      user: {
        userId: user.id,
        email: 'test@example.com',
      },
    } as any);

    const result = await controller.findOne(transaction.id, {
      user: {
        userId: user.id,
        email: 'test@example.com',
      },
    } as any);

    expect(result).toBeDefined();
    expect(result.amount).toEqual(100);
    expect(result.status).toEqual(transaction.status);
  });

  it('should create a transaction reversal', async () => {
    const user = await userController.create({
      email: 'test@example.com',
      password: '@13Wert01',
      name: 'Test User',
      balance: 5000,
    });

    const user2 = await userController.create({
      email: 'test2@example.com',
      password: '@13Wert01',
      name: 'Test User',
      balance: 5000,
    });

    const createTransactionDto: CreateTransactionDto = {
      amount: 100,
      receiverId: user2.id,
    };

    const transaction = await controller.create(createTransactionDto, {
      user: {
        userId: user.id,
        email: 'test@example.com',
      },
    } as any);

    const transactionReversalDto: CreateTransactionReversalDto = {
      code: transaction.code,
      reason: 'Test reason',
    };

    const result = await controller.reversal(transactionReversalDto, {
      user: {
        userId: user2.id,
        email: 'test@example.com',
      },
    } as any);

    expect(result).toBeDefined();
    expect(result.transactionId).toEqual(transaction.id);
    expect(result.reason).toEqual(transactionReversalDto.reason);
    expect(result.amount).toEqual(transaction.amount);
  });
});
