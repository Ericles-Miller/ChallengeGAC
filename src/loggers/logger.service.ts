import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import * as fs from 'fs';
import * as path from 'path';
import { TransactionReversal } from 'src/transactions/entities/transaction-reversal.entity';

const LOG_DIR =
  process.env.NODE_ENV === 'production' ? '/usr/src/app/logstash' : path.join(__dirname, '../../logstash');

@Injectable()
export class LoggerService {
  constructor() {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
  }

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

    const logPath = path.join(LOG_DIR, 'transaction-audit.log');
    fs.appendFileSync(logPath, JSON.stringify(logData) + '\n');
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

    const logPath = path.join(LOG_DIR, 'transaction-reversal-audit.log');
    fs.appendFileSync(logPath, JSON.stringify(logData) + '\n');
  }
}
