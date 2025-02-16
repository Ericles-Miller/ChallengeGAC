import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { EStatusTransactions } from './status-transaction.enum';
import { PaginatedListDto } from 'src/shared/Dtos/PaginatedList.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly dataSource: DataSource) {}

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
      await queryRunner.manager.save(Transaction, transaction);

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      )
        throw error;

      throw new InternalServerErrorException('Error to create a new transaction');
    } finally {
      await queryRunner.release();
    }
  }

  // findAll(
  //   page: number,
  //   limit: number,
  //   senderId: string,
  //   receiverName: string,
  // ): Promise<PaginatedListDto<User[]>> {

  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} transaction`;
  // }

  // update(id: number, updateTransactionDto: UpdateTransactionDto) {
  //   return `This action updates a #${id} transaction`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} transaction`;
  // }
}
