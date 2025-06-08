import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../jwt.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { Users } from '../../users/entities/users.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: {
    validateUser: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user if authService.validateUser returns a user', async () => {
      const payload = { id: '1', email: 'test@example.com' };
      const user = { id: '1', email: 'test@example.com' } as Users;

      authService.validateUser.mockResolvedValue(user);

      const result = await strategy.validate(payload);

      expect(result).toEqual(user);
      expect(authService.validateUser).toHaveBeenCalledWith(payload);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException if authService.validateUser returns null', async () => {
      const payload = { id: '1', email: 'test@example.com' };

      authService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(payload);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });
  });
});
