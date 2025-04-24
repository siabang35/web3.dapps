import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  address: string;



  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  symbol: string;

  @Column()
  decimals: number;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ type: 'decimal', precision: 36, scale: 18, default: 0 })
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isStakeable: boolean;

  @Column({ default: false })
  isSwappable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}