import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('revoked_tokens')
export class RevokedToken {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  token: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  revokedAt: Date;
}
