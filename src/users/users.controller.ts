import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.usersService.create(createUserDTO);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDto) {
    return this.usersService.update(id, updateUserDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
