import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { Users } from '../users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, Users])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
