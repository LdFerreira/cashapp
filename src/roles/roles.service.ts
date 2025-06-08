import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from './entities/roles.entity';
import { CreateRoleDTO } from './dto/create.role.dto';
import { UpdateRoleDTO } from './dto/update.role.dto';
import { Users } from '../users/entities/users.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findAll() {
    const roles = await this.rolesRepository.find();
    if (roles.length === 0) {
      throw new NotFoundException(`Roles not found`);
    }
    return roles;
  }

  async findOne(id: string) {
    const role = await this.rolesRepository.findOne({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  async create(createRoleDTO: CreateRoleDTO) {
    const role = this.rolesRepository.create(createRoleDTO);
    return this.rolesRepository.save(role);
  }

  async update(id: string, updateRoleDTO: UpdateRoleDTO) {
    //Procura e monta o objeto
    const roles = await this.rolesRepository.preload({
      ...updateRoleDTO,
      id,
    });
    if (!roles) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return this.rolesRepository.save(roles);
  }

  async changeRole(id: string, userId: string) {
    const roles = await this.rolesRepository.findOne({ where: { id } });
    if (!roles) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    user.role = roles;

    return await this.usersRepository.save(user);
  }
}
