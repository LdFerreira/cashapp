import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update.user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: '1', name: 'User 1', email: 'user1@example.com' },
        { id: '2', name: 'User 2', email: 'user2@example.com' },
      ];

      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should propagate exceptions from the service', async () => {
      mockUsersService.findAll.mockRejectedValue(
        new NotFoundException('Users not found'),
      );

      await expect(controller.findAll()).rejects.toThrow(NotFoundException);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user when found by ID', async () => {
      const mockUser = {
        id: '1',
        name: 'User 1',
        email: 'user1@example.com',
      };

      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should propagate exceptions from the service', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUsersService.findOne).toHaveBeenCalledWith('999');
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
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

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(id, updateUserDTO);

      expect(mockUsersService.update).toHaveBeenCalledWith(id, updateUserDTO);
      expect(result).toEqual(updatedUser);
    });

    it('should propagate exceptions from the service', async () => {
      const id = '999';
      const updateUserDTO: UpdateUserDto = {
        name: 'Updated User',
        email: 'user1@example.com',
      };

      mockUsersService.update.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.update(id, updateUserDTO)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUsersService.update).toHaveBeenCalledWith(id, updateUserDTO);
    });
  });
});
