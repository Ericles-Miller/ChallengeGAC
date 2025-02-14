import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableRevokedToken1739505522432 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE revoked_tokens (
        id SERIAL PRIMARY KEY,
        token VARCHAR NOT NULL,
        "revokedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE revoked_tokens');
  }
}
