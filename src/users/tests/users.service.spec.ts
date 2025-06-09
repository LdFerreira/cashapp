import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from '../dto/create.user.dto';
import { UpdateUserDto } from '../dto/update.user.dto';

jest.mock('class-transformer', () => ({
  plainToInstance: jest.fn().mockImplementation((dto, obj) => obj),
}));

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<Users>;

  const mockUsersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    preload: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          role: { id: '1', name: 'user' },
        },
        {
          id: '2',
          name: 'User 2',
          email: 'user2@example.com',
          role: { id: '1', name: 'user' },
        },
      ];

      mockUsersRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(mockUsersRepository.find).toHaveBeenCalledWith({
        relations: ['role'],
      });
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user when found by ID', async () => {
      const mockUser = {
        id: '1',
        name: 'User 1',
        email: 'user1@example.com',
        role: { id: '1', name: 'user' },
        account: { id: '1', code: 'ACC123' },
      };

      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['role', 'account'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '999' },
        relations: ['role', 'account'],
      });
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDTO: CreateUserDTO = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        birthdate: '1990-01-01',
      };

      const createdUser = {
        id: '3',
        ...createUserDTO,
      };

      mockUsersRepository.create.mockReturnValue(createdUser);
      mockUsersRepository.save.mockResolvedValue(createdUser);

      const result = await service.create(createUserDTO);

      expect(mockUsersRepository.create).toHaveBeenCalledWith(createUserDTO);
      expect(mockUsersRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });
  });

  describe('update', () => {
    it('should update and return a user when found by ID', async () => {
      const id = '1';
      const updateUserDTO: UpdateUserDto = {
        name: 'Updated User',
        email: 'user1@example.com',
      };

      const updatedUser = {
        id,
        name: 'Updated User',
        email: 'user1@example.com',
      };

      mockUsersRepository.preload.mockResolvedValue(updatedUser);
      mockUsersRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(id, updateUserDTO);

      expect(mockUsersRepository.preload).toHaveBeenCalledWith({
        ...updateUserDTO,
        id,
      });
      expect(mockUsersRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found during update', async () => {
      const id = '999';
      const updateUserDTO: UpdateUserDto = {
        name: 'Updated User',
        email: 'user1@example.com',
      };

      mockUsersRepository.preload.mockResolvedValue(null);

      await expect(service.update(id, updateUserDTO)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUsersRepository.preload).toHaveBeenCalledWith({
        ...updateUserDTO,
        id,
      });
      expect(mockUsersRepository.save).not.toHaveBeenCalled();
    });
  });
});
