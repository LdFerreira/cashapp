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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({
    status: 201,
    description: 'The account has been successfully created',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - requires admin role or cannot create account for self as admin',
  })
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

  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({
    status: 200,
    description: 'Returns all accounts',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires admin role',
  })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.accountService.findAll();
  }

  @ApiOperation({ summary: 'Get an account by code' })
  @ApiParam({
    name: 'code',
    description: 'The code of the account',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the account',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires admin role',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  @Get(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('code') code: string) {
    return this.accountService.findOne(code);
  }

  @ApiOperation({ summary: "Deposit money into the user's account" })
  @ApiResponse({
    status: 200,
    description: 'The deposit has been successfully processed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - user does not have an account',
  })
  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  @Roles('user')
  deposit(@Body() depositDto: DepositDto, @CurrentUser() user: JwtPayload) {
    if (!user.account?.code) {
      throw new ForbiddenException('You not have account, please create one');
    }
    return this.accountService.deposit(user.account?.code, depositDto);
  }

  @ApiOperation({ summary: "Withdraw money from the user's account" })
  @ApiResponse({
    status: 200,
    description: 'The withdrawal has been successfully processed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - user does not have an account',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - insufficient funds',
  })
  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  @Roles('user')
  withdraw(@Body() withdrawDto: WithdrawDto, @CurrentUser() user: JwtPayload) {
    if (!user.account?.code) {
      throw new ForbiddenException('You not have account, please create one');
    }
    return this.accountService.withdraw(user.account?.code, withdrawDto);
  }

  @ApiOperation({ summary: 'Transfer money to another account' })
  @ApiParam({
    name: 'toAccountId',
    description: 'The code of the recipient account',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'The transfer has been successfully processed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - user does not have an account',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - insufficient funds or invalid recipient account',
  })
  @ApiResponse({
    status: 404,
    description: 'Recipient account not found',
  })
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

  @ApiOperation({ summary: 'Get account statement with filters' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter transactions from this date',
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter transactions until this date',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the account statement',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - user does not have an account',
  })
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

  @ApiOperation({ summary: 'Reverse a transaction' })
  @ApiParam({
    name: 'transactionId',
    description: 'The ID of the transaction to reverse',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been successfully reversed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - transaction cannot be reversed',
  })
  @Post('reverse/:transactionId')
  @UseGuards(JwtAuthGuard)
  reverseTransaction(@Param('transactionId') transactionId: string) {
    return this.accountService.reverseTransaction(transactionId);
  }
}
