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
@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,
  ) {}
  async create(createAccountsDto: CreateAccountsDto) {
    const code = uuidv4().slice(0, 6);

    const existAccountCode = await this.accountsRepository.findOne({
      where: { code },
    });

    if (existAccountCode) {
      throw new NotFoundException(
        `Account with code ${code} already exists, try again`,
      );
    }
    const account = this.accountsRepository.create({
      user: createAccountsDto.userId,
      active: createAccountsDto.active,
      code,
    });
    return this.accountsRepository.save(account);
  }

  async findAll() {
    const accounts = await this.accountsRepository.find({
      where: { active: true },
      relations: ['user'],
    });

    return accounts;
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
    const currentBalance = parseFloat(account.balance);
    const depositAmount = depositDto.value;

    account.balance = (currentBalance + depositAmount).toFixed(2);

    return await this.accountsRepository.save(account);
  }

  async withdraw(code: string, withdrawDto: WithdrawDto) {
    const account = await this.findOne(code);
    const currentBalance = parseFloat(account.balance);
    const depositAmount = withdrawDto.value;

    account.balance = (currentBalance - depositAmount).toFixed(2);

    return await this.accountsRepository.save(account);
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
    const senderCurrentBalance = parseFloat(fromAccount.balance);
    const senderAmount = transferDto.value;

    if (senderCurrentBalance < senderAmount) {
      throw new NotFoundException(`Insufficient funds`);
    }
    fromAccount.balance = (senderCurrentBalance - senderAmount).toFixed(2);
    await this.accountsRepository.save(fromAccount);

    const receiverCurrentBalance = parseFloat(toAccount.balance);
    toAccount.balance = (receiverCurrentBalance + senderAmount).toFixed(2);
    await this.accountsRepository.save(toAccount);
    return fromAccount;
  }
}
