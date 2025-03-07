import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import * as fs from 'fs';
import * as path from 'path';
import { TransactionReversal } from 'src/transactions/entities/transaction-reversal.entity';

@Injectable()
export class LoggerService {
  async sendTransactionAuditLog(transaction: Transaction): Promise<void> {
    const { amount, receiverId, senderId, status, id, createdAt, code } = transaction;

    const logData = {
      '@timestamp': new Date().toISOString(),
      'event.type': 'transaction',
      transaction: {
        id,
        amount,
        status,
        code,
        createdAt,
      },
      users: {
        senderId,
        receiverId,
      },
      message: `Transaction ${id} created with amount ${amount} from ${senderId} to ${receiverId}`,
    };

    fs.appendFileSync(
      path.join(__dirname, '../../logstash/transaction-audit.log'),
      JSON.stringify(logData) + '\n',
    );
  }

  async sendTransactionReversalAuditLog(transactionReversal: TransactionReversal): Promise<void> {
    const { reason, reversedAt, transactionId, id, amount } = transactionReversal;

    const logData = {
      '@timestamp': new Date().toISOString(),
      'event.type': 'transaction_reversal',
      transaction_reversal: {
        id,
        amount,
        reason,
        reversedAt,
        transactionId,
      },
      message: `Transaction ${transactionId} reversed with amount ${amount}`,
    };

    fs.appendFileSync(
      path.join(__dirname, '../../logstash/transaction-reversal-audit.log'),
      JSON.stringify(logData) + '\n',
    );
  }
}
