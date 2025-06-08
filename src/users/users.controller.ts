import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: JwtPayload) {
    // Only admin users should be able to see all users
    // For now, we'll just return the authenticated user
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    // Check if the user is trying to access their own data
    console.log(`user`, user);
    if (id !== user.id) {
      throw new ForbiddenException('You can only access your own user data');
    }
    return this.usersService.findOne(id);
  }

  // @Post()
  // create(@Body() createUserDTO: CreateUserDTO) {
  //   // No authentication required for user creation (registration)
  //   return this.usersService.create(createUserDTO);
  // }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDTO: UpdateUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    // Check if the user is trying to update their own data
    if (id !== user.id) {
      throw new ForbiddenException('You can only update your own user data');
    }
    return this.usersService.update(id, updateUserDTO);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    // Check if the user is trying to delete their own data
    if (id !== user.id) {
      throw new ForbiddenException('You can only delete your own user data');
    }
    return this.usersService.remove(id);
  }
}
