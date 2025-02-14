import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLogger1739508088492 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        method VARCHAR NOT NULL,
        url VARCHAR NOT NULL,
        "statusCode" INT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "movieId" VARCHAR,
        ip VARCHAR NOT NULL,
        level VARCHAR NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warn', 'error')),
        "timeRequest" INT NOT NULL,
        "actionType" VARCHAR NOT NULL DEFAULT 'other' CHECK ("actionType" IN ('create', 'update', 'delete', 'other'))
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE logs;`);
  }
}
