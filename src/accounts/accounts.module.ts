import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities/users.entity';
import { Roles } from '../roles/entities/roles.entity';
import { Accounts } from './entities/accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accounts])],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
