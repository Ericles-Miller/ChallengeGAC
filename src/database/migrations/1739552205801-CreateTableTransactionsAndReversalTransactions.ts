import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTransactions1739552205801 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Create ENUM to transactions status 
      
     -- Create ENUM to transactions status
      DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estatusTransactions') THEN
              CREATE TYPE estatusTransactions AS ENUM ('COMPLETED', 'REVERSED', 'PENDING');
          END IF;
      END $$;

      -- Alter table transactions
      CREATE TABLE transactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "senderId" UUID NOT NULL,
          "receiverId" UUID NOT NULL,
          amount DOUBLE PRECISION NOT NULL,
          status estatusTransactions NOT NULL,
          code TEXT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP NULL,

          -- Remove userId and alter senderId relationship
          CONSTRAINT transactions_sender_id_fkey FOREIGN KEY ("senderId") REFERENCES users(id) ON DELETE CASCADE,
          CONSTRAINT transactions_receiver_id_fkey FOREIGN KEY ("receiverId") REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE INDEX transactions_idx ON transactions (id, "senderId", "receiverId", code);

      -- Criar a tabela "transactionsReversals"

      CREATE TABLE "transactionsReversals" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "transactionId" UUID NOT NULL,
        reason VARCHAR(250) NULL,
        "reversedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT transactions_reversals_transaction_id_fkey FOREIGN KEY ("transactionId") REFERENCES transactions(id) ON DELETE CASCADE
      );

      -- Create index to foreign key
      CREATE INDEX transactions_reversals_transaction_id_idx ON "transactionsReversals" ("transactionId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE transactionsReversals`);
    await queryRunner.query(`DROP TABLE transactions`);
    await queryRunner.query(`DROP TYPE IF EXISTS estatusTransactions`);
  }
}
