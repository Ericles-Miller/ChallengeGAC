import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { EStatusTransactions } from './status-transaction.enum';
import { PaginatedListDto } from 'src/shared/Dtos/PaginatedList.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionReversal } from './entities/transaction-reversal.entity';
import { CreateTransactionReversalDto } from './dto/create-transaction-reversal.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {}

  async create(senderId: string, { amount, receiverId }: CreateTransactionDto): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sender = await queryRunner.manager.findOne(User, { where: { id: senderId } });
      if (!sender) throw new NotFoundException('SenderId does not exist');
      if (!sender.isActive) throw new BadRequestException('Sender is not active');
      if (sender.balance < amount) throw new BadRequestException('Insufficient balance');

      const receiver = await queryRunner.manager.findOne(User, { where: { id: receiverId } });
      if (!receiver) throw new NotFoundException('ReceiverId does not exist');
      if (sender.id === receiver.id) throw new BadRequestException('Sender and Receiver cannot be the same');

      sender.balance -= amount;
      receiver.balance += amount;

      let transaction = new Transaction(amount, receiverId, senderId, EStatusTransactions.pending);

      transaction = await queryRunner.manager.save(Transaction, transaction);

      await queryRunner.manager.save(User, sender);
      await queryRunner.manager.save(User, receiver);

      transaction.status = EStatusTransactions.completed;
      transaction.setUpdatedAt();
      await queryRunner.manager.save(Transaction, transaction);

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Error to create a new transaction');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    page: number,
    limit: number,
    senderId: string,
    receiverName: string,
  ): Promise<PaginatedListDto<Transaction[]>> {
    try {
      const query = this.repository
        .createQueryBuilder('transaction')
        .innerJoinAndSelect('transaction.receiver', 'receiver')
        .where('transaction.senderId = :senderId', { senderId })
        .select([
          'transaction.id',
          'transaction.amount',
          'transaction.status',
          'transaction.code',
          'transaction.createdAt',
          'transaction.updatedAt',
          'receiver.id',
          'receiver.name',
        ]);

      if (receiverName)
        query.andWhere('unaccent(receiver.name) ILIKE :receiverName', {
          receiverName: `%${receiverName}%`,
        });

      const [transactions, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('transaction.createdAt', 'DESC')
        .getManyAndCount();

      return {
        data: transactions,
        total,
        page,
        limit,
      };
    } catch {
      throw new InternalServerErrorException('Error to find all transactions');
    }
  }

  async findOne(id: string, senderId: string): Promise<Transaction> {
    try {
      const transaction = await this.repository
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.receiver', 'receiver')
        .where('transaction.id = :id', { id })
        .andWhere('transaction.senderId = :senderId', { senderId })
        .select([
          'transaction.id',
          'transaction.amount',
          'transaction.status',
          'transaction.code',
          'transaction.createdAt',
          'receiver.id',
          'receiver.name',
        ])
        .getOne();

      if (!transaction) throw new NotFoundException('TransactionId does not exist');

      return transaction;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Error to find a transaction');
    }
  }

  async reversal(
    receiverId: string,
    { code, reason }: CreateTransactionReversalDto,
  ): Promise<TransactionReversal> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: { code, receiverId },
      });
      if (!transaction) throw new NotFoundException('Transaction does not exist or not belong to user.');

      if (transaction.status !== EStatusTransactions.completed)
        throw new BadRequestException(
          'To perform the transaction reversal, the transaction status must be completed.',
        );

      const receiver = await queryRunner.manager.findOne(User, { where: { id: transaction.receiverId } });
      if (receiver.balance < transaction.amount) throw new BadRequestException('Insufficient balance');

      const sender = await queryRunner.manager.findOne(User, { where: { id: transaction.senderId } });
      sender.balance += transaction.amount;
      receiver.balance -= transaction.amount;

      const transactionReversal = new TransactionReversal(transaction.id, reason, transaction.amount);
      await queryRunner.manager.save(TransactionReversal, transactionReversal);

      await queryRunner.manager.save(User, sender);
      await queryRunner.manager.save(User, receiver);

      transaction.status = EStatusTransactions.reversed;
      transaction.setUpdatedAt();
      await queryRunner.manager.save(Transaction, transaction);

      await queryRunner.commitTransaction();

      return transactionReversal;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Error to create a new transaction reversal');
    } finally {
      await queryRunner.release();
    }
  }
}
