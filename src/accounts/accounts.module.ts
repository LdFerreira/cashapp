import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from './entities/accounts.entity';
import { Transaction } from './entities/transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accounts, Transaction])],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
