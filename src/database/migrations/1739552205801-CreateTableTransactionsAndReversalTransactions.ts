import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTransactions1739552205801 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Create ENUM to transactions status 
      
      DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estatus_transactions') THEN
              CREATE TYPE estatus_transactions AS ENUM ('COMPLETED', 'REVERSED', 'PENDING');
          END IF;
      END $$;

      -- Create table transactions

      CREATE TABLE transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "senderId" UUID NOT NULL,
        "receiverId" UUID NOT NULL,
        amount DOUBLE PRECISION NOT NULL,
        status estatus_transactions NOT NULL,
        code TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NULL,

        CONSTRAINT transactions_sender_id_fkey FOREIGN KEY ("senderId") REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT transactions_receiver_id_fkey FOREIGN KEY ("receiverId") REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE INDEX transactions_idx ON transactions (id, "senderId", "receiverId", code);

      -- Criar a tabela transactions_reversals
      CREATE TABLE transactions_reversals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        transaction_id UUID NOT NULL,
        reason VARCHAR(250) NULL,
        reversed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT transactions_reversals_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
      );

      -- Create index to foreign key
      CREATE INDEX transactions_reversals_transaction_id_idx ON transactions_reversals (transaction_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE transactions_reversals`);
    await queryRunner.query(`DROP TABLE transactions`);
    await queryRunner.query(`DROP TYPE IF EXISTS estatus_transactions`);
  }
}
