import { RolesService } from './roles.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoleDTO } from './dto/create.role.dto';
import { UpdateRoleDTO } from './dto/update.role.dto';
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Get()
  findAll() {
    return this.rolesService.findAll()
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  create(@Body() createRoleDTO: CreateRoleDTO) {
    return this.rolesService.create(createRoleDTO);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDTO: UpdateRoleDTO) {
    return this.rolesService.update(id, updateRoleDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
  
}
