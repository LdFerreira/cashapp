import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../../users/entities/users.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    usersRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'test-token'),
          },
        },
        {
          provide: getRepositoryToken(Users),
          useValue: usersRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return an access token', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        birthdate: '1990-01-01',
        role: {
          id: '1',
          name: 'Admin',
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      const hashedPassword = 'hashed-password';
      const createdUser = {
        id: '1',
        ...registerDto,
        password: hashedPassword,
      };

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      usersRepository.create.mockReturnValue(createdUser);
      usersRepository.save.mockResolvedValue(createdUser);

      const result = await service.register(registerDto);
      expect(result).toEqual({
        email: 'test@example.com',
      });
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 'salt');
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
      expect(usersRepository.save).toHaveBeenCalledWith(createdUser);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: createdUser.id,
        email: createdUser.email,
      });
    });
  });

  describe('login', () => {
    it('should login a user and return an access token', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: '1',
        email: loginDto.email,
        password: 'hashed-password',
      };

      usersRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result).toEqual({ accessToken: 'test-token' });
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: '1',
        email: loginDto.email,
        password: 'hashed-password',
      };

      usersRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
    });
  });

  describe('validateUser', () => {
    it('should return a user if found by id', async () => {
      const payload = { id: '1', email: 'test@example.com' };
      const user = { id: '1', email: 'test@example.com' };

      usersRepository.findOne.mockResolvedValue(user);

      const result = await service.validateUser(payload);

      expect(result).toEqual(user);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: payload.id },
        relations: ['role', 'account'],
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const payload = { id: '1', email: 'test@example.com' };

      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.validateUser(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: payload.id },
        relations: ['role', 'account']
      });
    });
  });
});
