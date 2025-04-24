import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Token } from './token.entity';

@Entity('stakes')
export class Stake {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.stakes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Token)
  @JoinColumn({ name: 'tokenId' })
  token: Token;

  @Column()
  tokenId: string;

  @Column({ type: 'decimal', precision: 36, scale: 18 })
  amount: number;

  @Column({ type: 'decimal', precision: 36, scale: 18, default: 0 })
  rewards: number;

  @Column()
  txHash: string;

  @Column({ nullable: true })
  unstakeTxHash: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}