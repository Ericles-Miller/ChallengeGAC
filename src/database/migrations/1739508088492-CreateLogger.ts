import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLogger1739508088492 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Elevel') THEN
                CREATE TYPE Elevel AS ENUM ('info', 'warn', 'error', 'debug', 'trace');
            END IF;
        END $$;
    
      CREATE TABLE logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      method VARCHAR(25) NOT NULL,
      url VARCHAR(100) NOT NULL,
      "statusCode" INT NOT NULL,
      timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ip VARCHAR(50) NOT NULL,
      level Elevel NOT NULL,
      "timeRequest" INT NOT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE logs;`);
  }
}
