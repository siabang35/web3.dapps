import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Token } from './token.entity';

@Entity('swaps')
export class Swap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.swaps)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Token)
  @JoinColumn({ name: 'fromTokenId' })
  fromToken: Token;

  @Column()
  fromTokenId: string;

  @ManyToOne(() => Token)
  @JoinColumn({ name: 'toTokenId' })
  toToken: Token;

  @Column()
  toTokenId: string;

  @Column({ type: 'decimal', precision: 36, scale: 18 })
  fromAmount: number;

  @Column({ type: 'decimal', precision: 36, scale: 18 })
  toAmount: number;

  @Column()
  txHash: string;

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn()
  timestamp: Date;
}