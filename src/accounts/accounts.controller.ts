import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountsDto } from './dto/create.accounts.dto';
import { WithdrawDto } from './dto/withdraw.account.dto';
import { DepositDto } from './dto/deposit.account.dto';
import { TransferDto } from './dto/transfer.account.dto';
import { StatementFilterDto } from './entities/statement.account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(
    @Body() createAccountsDto: CreateAccountsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    if (user?.id === createAccountsDto?.userId) {
      throw new ForbiddenException(
        'You not create account, because you are admin. Please create account with role user',
      );
    }
    return this.accountService.create(createAccountsDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('code') code: string) {
    return this.accountService.findOne(code);
  }


  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  @Roles('user')
  deposit(@Body() depositDto: DepositDto, @CurrentUser() user: JwtPayload) {
    if (!user.account?.code) {
      throw new ForbiddenException('You not have account, please create one');
    }
    return this.accountService.deposit(user.account?.code, depositDto);
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  @Roles('user')
  withdraw(@Body() withdrawDto: WithdrawDto, @CurrentUser() user: JwtPayload) {
    if (!user.account?.code) {
      throw new ForbiddenException('You not have account, please create one');
    }
    return this.accountService.withdraw(user.account?.code, withdrawDto);
  }

  @Post('transfer/:toAccountId')
  @UseGuards(JwtAuthGuard)
  @Roles('user')
  transfer(
    @Param('toAccountId') toCode: string,
    @Body() transferDto: TransferDto,
    @CurrentUser() user: JwtPayload,
  ) {
    if (!user.account?.code) {
      throw new ForbiddenException('You not have account, please create one');
    }
    return this.accountService.transfer(
      user.account?.code,
      toCode,
      transferDto,
    );
  }

  @Get('statement/consult')
  @UseGuards(JwtAuthGuard)
  getStatement(
    @Query() filters: StatementFilterDto,
    @CurrentUser() user: JwtPayload,
  ) {
    if (!user.account?.code) {
      throw new ForbiddenException('You not have account, please create one');
    }
    return this.accountService.getAccountStatement(user.account?.code, filters);
  }

  @Post('reverse/:transactionId')
  @UseGuards(JwtAuthGuard)
  reverseTransaction(@Param('transactionId') transactionId: string) {
    return this.accountService.reverseTransaction(transactionId);
  }
}
