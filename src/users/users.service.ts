import { Injectable, NotFoundException } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { CreateUserDTO } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from './dto/list.user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findAll() {
    const users = await this.usersRepository.find({
      relations: ['role'],
    });
    console.log(`users`, users);
    return plainToInstance(UserDTO, users, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'account'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(createUserDTO: CreateUserDTO) {
    const user = this.usersRepository.create(createUserDTO);
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDTO: UpdateUserDto) {
    const users = await this.usersRepository.preload({
      ...updateUserDTO,
      id,
    });
    if (!users) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.usersRepository.save(users);
  }

  // async remove(id: string) {
  //   const user = await this.usersRepository.findOne({
  //     where: { id },
  //   });
  //
  //   if (!user) {
  //     throw new NotFoundException(`User with id ${id} not found`);
  //   }
  //   return this.usersRepository.remove(user);
  // }
}
