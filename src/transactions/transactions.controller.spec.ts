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
});
