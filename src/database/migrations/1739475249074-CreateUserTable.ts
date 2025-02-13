import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1739475249074 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
              "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
              "name" varchar(255) NOT NULL,
              "email" varchar(255) NOT NULL UNIQUE,
              "password" varchar(300) NOT NULL,
              "balance" float NOT NULL DEFAULT 0.0,
              "isActive" boolean NOT NULL DEFAULT true,
              "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" timestamptz,
              "lastLogin" timestamptz,
              "refreshTokenCode" varchar(255),
              CONSTRAINT "UQ_users_email" UNIQUE ("email")
            );
          `);

    await queryRunner.query(`
            CREATE INDEX "IDX_users_id_email" ON "users" ("id", "email");
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_users_id_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
