import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountsDto } from './dto/create-accounts.dto';
import { UpdateAccountsDto } from './dto/update-accounts.dto';

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
}
