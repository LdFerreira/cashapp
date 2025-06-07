import {
  Column, CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { Roles } from '../../roles/entities/roles.entity';
import { Accounts } from '../../accounts/entities/accounts.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  birthdate: string;

  @OneToOne(() => Roles)
  @JoinColumn()
  role?: Roles;
  @OneToOne(() => Accounts, (account) => account.user)
  account: Accounts;
  @Column({ default: true })
  active?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
