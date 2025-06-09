import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('roles')
export class Roles {
  @ApiProperty({
    description: 'The unique identifier of the role',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the role',
    example: 'admin',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The users with this role',
    type: () => [Users],
  })
  @OneToMany(() => Users, (user) => user.role)
  users: Users[];

  @ApiProperty({
    description: 'The date when the role was created',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the role was last updated',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
