import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('revokedTokens')
export class RevokedToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  token: string;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  revokedAt: Date;
}
