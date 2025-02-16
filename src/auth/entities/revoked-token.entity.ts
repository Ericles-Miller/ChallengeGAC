import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('revoked_tokens')
export class RevokedToken {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  token: string;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  revokedAt: Date;
}
