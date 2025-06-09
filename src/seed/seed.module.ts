import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities/users.entity';
import { Roles } from '../roles/entities/roles.entity';
import { SeederService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles])],
  providers: [SeederService],
})
export class SeederModule {}
