import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from '../roles.controller';
import { RolesService } from '../roles.service';
import { NotFoundException } from '@nestjs/common';
import { CreateRoleDTO } from '../dto/create.role.dto';
import { UpdateRoleDTO } from '../dto/update.role.dto';

describe('RolesController', () => {
  let controller: RolesController;
  let rolesService: {
    findAll: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    rolesService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: rolesService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const roles = [
        { id: '1', name: 'Admin' },
        { id: '2', name: 'User' },
      ];
      rolesService.findAll.mockResolvedValue(roles);

      const result = await controller.findAll();
      expect(result).toEqual(roles);
      expect(rolesService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should propagate exceptions from the service', async () => {
      rolesService.findAll.mockRejectedValue(
        new NotFoundException('Roles not found'),
      );

      await expect(controller.findAll()).rejects.toThrow(NotFoundException);
      expect(rolesService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a role when found by ID', async () => {
      const role = { id: '1', name: 'Admin' };
      rolesService.findOne.mockResolvedValue(role);

      const mockUser = {
        id: '1',
        email: 'admin@example.com',
        role: { name: 'admin' },
      };
      const result = await controller.findOne('1', mockUser);
      expect(result).toEqual(role);
      expect(rolesService.findOne).toHaveBeenCalledWith('1');
      expect(rolesService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should propagate exceptions from the service', async () => {
      rolesService.findOne.mockRejectedValue(
        new NotFoundException('Role not found'),
      );

      const mockUser = {
        id: '1',
        email: 'admin@example.com',
        role: { name: 'admin' },
      };
      await expect(controller.findOne('999', mockUser)).rejects.toThrow(
        NotFoundException,
      );
      expect(rolesService.findOne).toHaveBeenCalledWith('999');
      expect(rolesService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create and return a role', async () => {
      const createRoleDTO: CreateRoleDTO = { name: 'Admin' };
      const createdRole = { id: '1', name: 'Admin' };
      rolesService.create.mockResolvedValue(createdRole);

      const result = await controller.create(createRoleDTO);
      expect(result).toEqual(createdRole);
      expect(rolesService.create).toHaveBeenCalledWith(createRoleDTO);
      expect(rolesService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update and return a role', async () => {
      const id = '1';
      const updateRoleDTO: UpdateRoleDTO = { name: 'Updated Admin' };
      const updatedRole = { id, name: 'Updated Admin' };
      rolesService.update.mockResolvedValue(updatedRole);

      const result = await controller.update(id, updateRoleDTO);
      expect(result).toEqual(updatedRole);
      expect(rolesService.update).toHaveBeenCalledWith(id, updateRoleDTO);
      expect(rolesService.update).toHaveBeenCalledTimes(1);
    });

    it('should propagate exceptions from the service', async () => {
      const id = '999';
      const updateRoleDTO: UpdateRoleDTO = { name: 'Updated Role' };
      rolesService.update.mockRejectedValue(
        new NotFoundException(`Role with id ${id} not found`),
      );

      await expect(controller.update(id, updateRoleDTO)).rejects.toThrow(
        NotFoundException,
      );
      expect(rolesService.update).toHaveBeenCalledWith(id, updateRoleDTO);
      expect(rolesService.update).toHaveBeenCalledTimes(1);
    });
  });
});
