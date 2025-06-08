import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountsDto } from './dto/create.accounts.dto';
import { UpdateAccountsDto } from './dto/update.accounts.dto';
import { Accounts } from './entities/accounts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { WithdrawDto } from './dto/withdraw.account.dto';
import { DepositDto } from './dto/deposit.account.dto';
import { TransferDto } from './dto/transfer.account.dto';
import { Transaction } from './entities/transactions.entity';
import { TransactionType } from './entities/transactions.enum';
import { StatementFilterDto } from './entities/statement.account.dto';
import { addHours, endOfDay, subHours } from 'date-fns';

@Injectable()
export class AccountsService {
  private static readonly ACCOUNT_CODE_LENGTH = 6;
  private static readonly DECIMAL_PLACES = 2;

  constructor(
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  async create(createAccountsDto: CreateAccountsDto) {
    const code = uuidv4().slice(0, AccountsService.ACCOUNT_CODE_LENGTH);
    await this.validateUniqueAccountCode(code);

    const account = this.accountsRepository.create({
      user: createAccountsDto.userId,
      active: createAccountsDto.active,
      code,
    });
    return this.accountsRepository.save(account);
  }

  private async validateUniqueAccountCode(code: string): Promise<void> {
    const existingAccount = await this.accountsRepository.findOne({
      where: { code },
    });
    if (existingAccount) {
      throw new NotFoundException(
        `Account with code ${code} already exists, try again`,
      );
    }
  }

  async findAll() {
    return this.accountsRepository.find({
      where: { active: true },
      relations: ['user'],
    });
  }

  async findOne(code: string) {
    const account = await this.accountsRepository.findOne({
      where: { code },
      relations: ['user'],
    });
    if (!account) {
      throw new NotFoundException(`Account with code ${code} not found`);
    }
    return account;
  }

  async changeStatus(id: string, updateAccountsDto: UpdateAccountsDto) {
    const account = await this.accountsRepository.preload({
      ...updateAccountsDto,
      id,
    });
    if (!account) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.accountsRepository.save(account);
  }

  async deposit(code: string, depositDto: DepositDto) {
    const account = await this.findOne(code);
    const originalBalance = account.balance;

    const { newBalance, updatedAccount } = await this.processBalanceUpdate(
      account,
      depositDto.value,
      'add',
    );
    await this.createTransactionRecord({
      type: TransactionType.DEPOSIT,
      amount: depositDto.value,
      beforeBalance: parseFloat(originalBalance),
      afterBalance: parseFloat(newBalance),
      account: updatedAccount,
    });

    return { amount: updatedAccount.balance };
  }

  async withdraw(code: string, withdrawDto: WithdrawDto) {
    const account = await this.findOne(code);
    const originalBalance = account.balance;
    const { newBalance, updatedAccount } = await this.processBalanceUpdate(
      account,
      withdrawDto.value,
      'subtract',
    );

    await this.createTransactionRecord({
      type: TransactionType.WITHDRAW,
      amount: withdrawDto.value,
      beforeBalance: parseFloat(originalBalance),
      afterBalance: parseFloat(newBalance),
      account: updatedAccount,
    });

    return { amount: updatedAccount.balance };
  }

  async transfer(
    fromAccountId: string,
    toAccountId: string,
    transferDto: TransferDto,
  ) {
    const [fromAccount, toAccount] = await Promise.all([
      this.findOne(fromAccountId),
      this.findOne(toAccountId),
    ]);

    const senderBalance = parseFloat(fromAccount.balance);
    if (senderBalance < transferDto.value) {
      throw new NotFoundException('Insufficient funds');
    }

    const { updatedAccount: updatedSender } = await this.processBalanceUpdate(
      fromAccount,
      transferDto.value,
      'subtract',
    );
    const { updatedAccount: updatedReceiver } = await this.processBalanceUpdate(
      toAccount,
      transferDto.value,
      'add',
    );
    await this.createTransferTransactions(
      updatedSender,
      updatedReceiver,
      transferDto.value,
    );

    return { amount: updatedSender.balance };
  }

  private async processBalanceUpdate(
    accountToChange: Accounts,
    amount: number,
    operation: 'add' | 'subtract',
  ) {
    const currentBalance = parseFloat(accountToChange.balance);
    const newBalance =
      operation === 'add'
        ? (currentBalance + amount).toFixed(AccountsService.DECIMAL_PLACES)
        : (currentBalance - amount).toFixed(AccountsService.DECIMAL_PLACES);

    accountToChange.balance = newBalance;
    const updatedAccount = await this.accountsRepository.save(accountToChange);
    return { newBalance, updatedAccount };
  }

  private async createTransactionRecord(params: {
    type: TransactionType;
    amount: number;
    beforeBalance: number;
    afterBalance: number;
    account: Accounts;
    fromAccountId?: string;
    toAccountId?: string;
  }) {
    const transaction = this.transactionsRepository.create({
      type: params.type,
      amount: params.amount,
      before_balance: params.beforeBalance,
      after_balance: params.afterBalance,
      account_id: params.account.id,
      account: params.account,
      from_account_id: params.fromAccountId,
      to_account_id: params.toAccountId,
    });
    return this.transactionsRepository.save(transaction);
  }

  private async createTransferTransactions(
    sender: Accounts,
    receiver: Accounts,
    amount: number,
  ) {
    const currentSenderBalance = parseFloat(sender.balance);
    const currentReceiverBalance = parseFloat(receiver.balance);
    const beforeSenderBalance = currentSenderBalance + amount;
    const beforeReceiverBalance = currentReceiverBalance - amount;
    await Promise.all([
      this.createTransactionRecord({
        type: TransactionType.TRANSFER,
        amount,
        beforeBalance: beforeSenderBalance,
        afterBalance: parseFloat(sender.balance),
        account: sender,
        fromAccountId: sender.id,
        toAccountId: receiver.id,
      }),
      this.createTransactionRecord({
        type: TransactionType.TRANSFER,
        amount,
        beforeBalance: beforeReceiverBalance,
        afterBalance: parseFloat(receiver.balance),
        account: receiver,
        fromAccountId: sender.id,
        toAccountId: receiver.id,
      }),
    ]);
  }

  async getAccountStatement(code: string, filters: StatementFilterDto) {
    const account = await this.accountsRepository.findOneBy({ code: code });
    if (!account) {
      throw new NotFoundException(`Account with code ${code} not found`);
    }
    const query = this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.account_id = :accountId', { accountId: account.id });
    if (filters.type) {
      query.andWhere('transaction.type = :type', { type: filters.type });
    }

    if (filters.startDate) {
      const startDate = endOfDay(new Date(filters.startDate));
      query.andWhere('transaction.createdAt >= :startDate', {
        startDate: startDate,
      });
    }

    if (filters.endDate) {
      const endDate = addHours(new Date(filters.endDate), 24);
      query.andWhere('transaction.createdAt <= :endDate', {
        endDate: endDate.toISOString(),
      });
    }

    // Ordena por data decrescente
    const transactions = await query
      .orderBy('transaction.createdAt', 'DESC')
      .getMany();


    return {
      accountId: account.id,
      currentBalance: account.balance,
      filteredCount: transactions.length,
      transactions: transactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        before_balance: tx.before_balance,
        after_balance: tx.after_balance,
        date: subHours(tx.createdAt, 3),
        to_account_id: tx.to_account_id ?? null,
      })),
    };
  }
}
