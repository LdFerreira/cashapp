import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionType } from './transactions.enum';
import { Accounts } from './accounts.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  before_balance: number;

  @Column('decimal', { precision: 12, scale: 2 })
  after_balance: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Accounts)
  @JoinColumn({ name: 'account_id' })
  account: Accounts;

  @Column()
  account_id: string;

  @Column({ nullable: true })
  to_account_id?: string;

  @Column({ nullable: true })
  from_account_id?: string;
}
