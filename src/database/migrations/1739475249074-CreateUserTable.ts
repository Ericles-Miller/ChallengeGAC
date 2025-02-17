import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1739475249074 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(300) NOT NULL,
        balance float NOT NULL DEFAULT 0.00,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP,
        "refreshTokenCode" VARCHAR(255),
        CONSTRAINT UQ_users_email UNIQUE (email)
      );`);

    await queryRunner.query(`
      CREATE INDEX IDX_users_id_email ON users (id, email);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_users_id_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
