import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/entities/users.entity';

@Entity('accounts')
export class Accounts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  code: string;

  @OneToOne(() => Users)
  @JoinColumn() // Este lado possui a FK userId
  user: Users;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  balance: number;

  @Column('boolean', { default: true, nullable: false })
  active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
