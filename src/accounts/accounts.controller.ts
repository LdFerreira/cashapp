import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountsDto } from './dto/create.accounts.dto';
import { UpdateAccountsDto } from './dto/update.accounts.dto';
import { WithdrawDto } from './dto/withdraw.account.dto';
import { DepositDto } from './dto/deposit.account.dto';
import { TransferDto } from './dto/transfer.account.dto';
import { StatementFilterDto } from './entities/statement.account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @Post()
  create(@Body() createAccountsDto: CreateAccountsDto) {
    return this.accountService.create(createAccountsDto);
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.accountService.findOne(code);
  }

  @Put(':id')
  remove(
    @Param('id') id: string,
    @Body() updateAccountsDto: UpdateAccountsDto,
  ) {
    return this.accountService.changeStatus(id, updateAccountsDto);
  }

  @Post('deposit/:code')
  deposit(@Param('code') code: string, @Body() depositDto: DepositDto) {
    return this.accountService.deposit(code, depositDto);
  }

  @Post('withdraw/:code')
  withdraw(@Param('code') code: string, @Body() withdrawDto: WithdrawDto) {
    return this.accountService.withdraw(code, withdrawDto);
  }

  @Post('transfer/:fromAccountId/:toAccountId')
  transfer(
    @Param('fromAccountId') fromCode: string,
    @Param('toAccountId') toCode: string,
    @Body() transferDto: TransferDto,
  ) {
    return this.accountService.transfer(fromCode, toCode, transferDto);
  }
  @Get('statement/:code')
  getStatement(
    @Param('code') code: string,
    @Query() filters: StatementFilterDto,
  ) {
    return this.accountService.getAccountStatement(code, filters);
  }
}
