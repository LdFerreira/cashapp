import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from '../../roles/entities/roles.entity';
import { Accounts } from '../../accounts/entities/accounts.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class Users {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'hashed_password',
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'The birthdate of the user',
    example: '1990-01-01',
  })
  @Column()
  birthdate: string;

  @ApiProperty({
    description: 'The role of the user',
    type: () => Roles,
  })
  @ManyToOne(() => Roles, (role) => role.users)
  @JoinColumn()
  role: Roles;

  @ApiProperty({
    description: 'The account of the user',
    type: () => Accounts,
  })
  @OneToOne(() => Accounts, (account) => account.user)
  account: Accounts;

  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
    default: true,
  })
  @Column({ default: true })
  active?: boolean;

  @ApiProperty({
    description: 'The date when the user was created',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the user was last updated',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
