import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { IsSelfGuard } from '../auth/is-self.guard';
import { IsSelf } from '../auth/is-self.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, IsSelfGuard)
  @IsSelf('id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard, IsSelfGuard)
  @IsSelf('id')
  update(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDto) {
    return this.usersService.update(id, updateUserDTO);
  }

  // @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
  //   // Check if the user is trying to delete their own data
  //   if (id !== user.id) {
  //     throw new ForbiddenException('You can only delete your own user data');
  //   }
  //   return this.usersService.remove(id);
  // }
}
