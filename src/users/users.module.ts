import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Roles } from '../roles/entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
