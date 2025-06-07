import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Users } from './users.entity';
import { CreateUserDTO } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {
  private users: Users[] = [
    {
      id: 1,
      name: 'John Doe',
      birthdate: '1990-01-01',
      role: ['user'],
    },
    {
      id: 2,
      name: 'Jane Smith',
      birthdate: '1992-05-15',
      role: ['admin'],
    },
  ];

  findAll(): Users[] {
    return this.users;
  }

  findOne(id: number): Users {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  create(createUserDTO: CreateUserDTO): Users {
    const newUser: Users = {
      ...createUserDTO,
      id: Math.max(...this.users.map((u) => u.id)) + 1,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDTO: UpdateUserDto): Users {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDTO };
    return this.users[userIndex];
  }

  remove(id: number): void {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    this.users.splice(userIndex, 1);
  }
}
