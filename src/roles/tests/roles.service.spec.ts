import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Roles } from '../entities/roles.entity';

describe('RolesService', () => {
  let service: RolesService;
  let rolesRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    preload: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    rolesRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      preload: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: getRepositoryToken(Roles), useValue: rolesRepository },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const roles = [{ id: '1', name: 'Admin' }];
      rolesRepository?.find?.mockResolvedValue(roles);

      const result = await service.findAll();
      expect(result).toEqual(roles);
      expect(rolesRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if no roles are found', async () => {
      rolesRepository?.find?.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
      expect(rolesRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a role when found by ID', async () => {
      const role = {
        id: '1',
        name: 'Admin',
      };
      rolesRepository?.findOne?.mockResolvedValue(role);

      const result = await service.findOne('1');
      expect(result).toEqual(role);
      expect(rolesRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(rolesRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if no role is found by ID', async () => {
      rolesRepository?.findOne?.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(rolesRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(rolesRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should successfully create and return a role', async () => {
      const createRoleDTO = { name: 'Admin' };
      const createdRole = { ...createRoleDTO };
      const savedRole = { id: '1', ...createRoleDTO };

      rolesRepository.create?.mockReturnValue(createdRole);
      rolesRepository.save?.mockResolvedValue(savedRole);

      const result = await service.create(createRoleDTO);

      expect(result).toEqual(savedRole);
      expect(rolesRepository.create).toHaveBeenCalledWith(createRoleDTO);
      expect(rolesRepository.save).toHaveBeenCalledWith(createdRole);
      expect(rolesRepository.create).toHaveBeenCalledTimes(1);
      expect(rolesRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update and return a role when found by ID', async () => {
      const id = '1';
      const updateRoleDTO = { name: 'Updated Admin' };
      const updatedRole = { id, name: 'Updated Admin' };

      rolesRepository.preload?.mockResolvedValue(updatedRole);
      rolesRepository.save?.mockResolvedValue(updatedRole);

      const result = await service.update(id, updateRoleDTO);

      expect(result).toEqual(updatedRole);
      expect(rolesRepository.preload).toHaveBeenCalledWith({
        ...updateRoleDTO,
        id,
      });
      expect(rolesRepository.save).toHaveBeenCalledWith(updatedRole);
      expect(rolesRepository.preload).toHaveBeenCalledTimes(1);
      expect(rolesRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if no role is found by ID during update', async () => {
      const id = '999';
      const updateRoleDTO = { name: 'Updated Role' };

      rolesRepository.preload.mockResolvedValue(null);

      await expect(service.update(id, updateRoleDTO)).rejects.toThrow(
        NotFoundException,
      );
      expect(rolesRepository.preload).toHaveBeenCalledWith({
        ...updateRoleDTO,
        id,
      });
      expect(rolesRepository.preload).toHaveBeenCalledTimes(1);
      expect(rolesRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove and return a role when found by ID', async () => {
      const id = '1';
      const role = { id, name: 'Admin' };

      rolesRepository.findOne.mockResolvedValue(role);
      rolesRepository.remove.mockResolvedValue(role);

      const result = await service.remove(id);

      expect(result).toEqual(role);
      expect(rolesRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(rolesRepository.remove).toHaveBeenCalledWith(role);
      expect(rolesRepository.findOne).toHaveBeenCalledTimes(1);
      expect(rolesRepository.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if no role is found by ID during remove', async () => {
      const id = '999';

      rolesRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      expect(rolesRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(rolesRepository.findOne).toHaveBeenCalledTimes(1);
      expect(rolesRepository.remove).not.toHaveBeenCalled();
    });
  });
});
