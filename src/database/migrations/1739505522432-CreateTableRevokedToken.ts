import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableRevokedToken1739505522432 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "revokedTokens" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        token TEXT NOT NULL,
        "revokedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "revokedTokens"');
  }
}
