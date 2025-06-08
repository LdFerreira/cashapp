import { RolesService } from './roles.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRoleDTO } from './dto/create.role.dto';
import { UpdateRoleDTO } from './dto/update.role.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.rolesService.findAll();
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    if (!user?.role?.name || user.role.name !== 'admin') {
      throw new ForbiddenException(
        'You not have permission to access this route',
      );
    }
    return this.rolesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(
    @Body() createRoleDTO: CreateRoleDTO,
    @CurrentUser() user: JwtPayload,
  ) {
    if (!user?.role?.name || user.role.name !== 'admin') {
      throw new ForbiddenException(
        'You not have permission to access this route',
      );
    }
    return this.rolesService.create(createRoleDTO);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateRoleDTO: UpdateRoleDTO) {
    return this.rolesService.update(id, updateRoleDTO);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
