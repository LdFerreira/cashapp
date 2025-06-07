import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountsDto } from './dto/create-accounts.dto';
import { UpdateAccountsDto } from './dto/update-accounts.dto';
import { Accounts } from './entities/accounts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
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
}
