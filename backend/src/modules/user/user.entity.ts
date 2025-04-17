import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'wallet_address', unique: true })
  walletAddress: string;

  @Column({ nullable: true })
  username: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
