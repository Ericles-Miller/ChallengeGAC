import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/Jwt-auth-guard';
import { ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RevokedToken } from 'src/auth/entities/revoked-token.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionReversal } from 'src/transactions/entities/transaction-reversal.entity';

describe('UsersController (Integration)', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
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
              request.user = { id: 1, email: 'authuser@example.com' };
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

        TypeOrmModule.forFeature([User, RevokedToken]),

        JwtModule.register({
          secret: 'dc57f9ec-c6b2-477f-a6af-fc57c1b86be0',
          signOptions: { expiresIn: '1h' },
        }),
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Create User - Integration Test', () => {
    it('should create a new user', async () => {
      const user = await controller.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '@18Pack12340',
        balance: 0,
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('john.doe@example.com');
      expect(user.name).toBe('John Doe');
      expect(user.balance).toBe(0);
    });
  });

  it('should return a list of users', async () => {
    const userOne = await controller.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '@18Pack12340',
      balance: 0,
    });

    const userTwo = await controller.create({
      name: 'Mark Doe',
      email: 'mark.doe@example.com',
      password: '@18Pack12340',
      balance: 1000,
    });

    const users = await controller.findAll('1', '10');
    expect(users).toBeDefined();
    expect(users.data).toHaveLength(2);
    expect(users.data[0]).toEqual(userOne);
    expect(users.data[1]).toEqual(userTwo);
  });
});
