import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTransactions1739552205801 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS unaccent;

      DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estatusTransactions') THEN
                CREATE TYPE estatusTransactions AS ENUM ('COMPLETED', 'REVERSED', 'PENDING');
            END IF;
        END $$;

      CREATE TABLE transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "senderId" UUID NOT NULL,
        "receiverId" UUID NOT NULL,
        amount float NOT NULL,
        status estatusTransactions NOT NULL,
        code VARCHAR(80) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NULL,
        CONSTRAINT transactions_sender_id_fkey FOREIGN KEY ("senderId") REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT transactions_receiver_id_fkey FOREIGN KEY ("receiverId") REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE INDEX transactions_idx ON transactions ("senderId", "receiverId", code);

      CREATE TABLE "transactionsReversals" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "transactionId" UUID NOT NULL,
        reason VARCHAR(250) NOT NULL,
        "reversedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        amount float NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NULL,
        CONSTRAINT transactions_reversals_transaction_id_fkey FOREIGN KEY ("transactionId") REFERENCES transactions(id) ON DELETE CASCADE
      );

      CREATE INDEX transactions_reversals_transaction_id_idx ON "transactionsReversals" ("transactionId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transactionsReversals"`);
    await queryRunner.query(`DROP TABLE transactions`);
    await queryRunner.query(`DROP TYPE IF EXISTS estatusTransactions`);
  }
}
