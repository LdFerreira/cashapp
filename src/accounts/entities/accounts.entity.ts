import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { Transaction } from './transactions.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('accounts')
export class Accounts {
  @ApiProperty({
    description: 'The unique identifier of the account',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The unique code of the account',
    example: 'ACC123456',
  })
  @Column('varchar', { unique: true })
  code: string;

  @ApiProperty({
    description: 'The user who owns the account',
    type: () => Users,
  })
  @OneToOne(() => Users)
  @JoinColumn() // Este lado possui a FK userId
  user: Users;

  @ApiProperty({
    description: 'The current balance of the account',
    example: '1000.00',
  })
  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  balance: string;

  @ApiProperty({
    description: 'Whether the account is active',
    example: true,
    default: true,
  })
  @Column('boolean', { default: true, nullable: false })
  active: boolean;

  @ApiProperty({
    description: 'The transactions associated with the account',
    type: () => [Transaction],
  })
  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @ApiProperty({
    description: 'The date when the account was created',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the account was last updated',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
