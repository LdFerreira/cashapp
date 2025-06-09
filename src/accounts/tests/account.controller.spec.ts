import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from '../accounts.controller';
import { AccountsService } from '../accounts.service';
import { CreateAccountsDto } from '../dto/create.accounts.dto';
import { DepositDto } from '../dto/deposit.account.dto';
import { WithdrawDto } from '../dto/withdraw.account.dto';
import { TransferDto } from '../dto/transfer.account.dto';
import { StatementFilterDto } from '../entities/statement.account.dto';
import { ForbiddenException } from '@nestjs/common';
import { JwtPayload } from '../../auth/jwt-payload.interface';

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: AccountsService;

  const mockAccountsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    deposit: jest.fn(),
    withdraw: jest.fn(),
    transfer: jest.fn(),
    getAccountStatement: jest.fn(),
    reverseTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: mockAccountsService,
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get<AccountsService>(AccountsService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new account', async () => {
      const createAccountDto: CreateAccountsDto = {
        userId: 'user-id',
      };
      const mockUser: JwtPayload = {
        id: 'admin-id',
        email: 'admin@admin',
        role: {
          name: 'admin',
        },
      };
      const mockAccount = {
        id: 'account-id',
        code: 'ACC123',
        balance: '0.00',
      };

      mockAccountsService.create.mockResolvedValue(mockAccount);

      const result = await controller.create(createAccountDto, mockUser);

      expect(mockAccountsService.create).toHaveBeenCalledWith(createAccountDto);
      expect(result).toEqual(mockAccount);
    });

    it('should throw ForbiddenException if admin tries to create account for themselves', async () => {
      const createAccountDto: CreateAccountsDto = {
        userId: 'admin-id',
      };
      const mockUser: JwtPayload = {
        id: 'admin-id',
        email: 'admin@admin',
        role: {
          name: 'admin',
        },
      };

      try {
        await controller.create(createAccountDto, mockUser);
        fail('Expected ForbiddenException to be thrown');
      } catch (err: unknown) {
        const error = err as Error;
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe(
          'You not create account, because you are admin. Please create account with role user',
        );
        expect(mockAccountsService.create).not.toHaveBeenCalled();
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of accounts', async () => {
      const mockAccounts = [
        { id: 'account-id-1', code: 'ACC123', balance: '100.00' },
        { id: 'account-id-2', code: 'ACC456', balance: '200.00' },
      ];

      mockAccountsService.findAll.mockResolvedValue(mockAccounts);

      const result = await controller.findAll();

      expect(mockAccountsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockAccounts);
    });
  });

  describe('findOne', () => {
    it('should return an account by code', async () => {
      const mockAccount = {
        id: 'account-id',
        code: 'ACC123',
        balance: '100.00',
      };

      mockAccountsService.findOne.mockResolvedValue(mockAccount);

      const result = await controller.findOne('ACC123');

      expect(mockAccountsService.findOne).toHaveBeenCalledWith('ACC123');
      expect(result).toEqual(mockAccount);
    });
  });

  describe('deposit', () => {
    it('should deposit money into an account', async () => {
      const depositDto: DepositDto = { value: 100 };
      const mockUser: JwtPayload = {
        id: 'user-id',
        email: 'user@example.com',
        role: {
          name: 'user',
        },
        account: { code: 'ACC123' },
      };
      const mockResult = {
        id: 'tx-id',
        type: 'deposit',
        amount: 100,
      };

      mockAccountsService.deposit.mockResolvedValue(mockResult);

      const result = await controller.deposit(depositDto, mockUser);

      expect(mockAccountsService.deposit).toHaveBeenCalledWith(
        'ACC123',
        depositDto,
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw ForbiddenException if user has no account', async () => {
      const depositDto: DepositDto = { value: 100 };
      const mockUser: JwtPayload = {
        id: 'user-id',
        email: 'user@example.com',
        role: {
          name: 'user',
        },
      };

      try {
        await controller.deposit(depositDto, mockUser);
        fail('Expected ForbiddenException to be thrown');
      } catch (err: unknown) {
        const error = err as Error;
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('You not have account, please create one');
        expect(mockAccountsService.deposit).not.toHaveBeenCalled();
      }
    });
  });

  describe('withdraw', () => {
    it('should withdraw money from an account', async () => {
      const withdrawDto: WithdrawDto = { value: 50 };
      const mockUser: JwtPayload = {
        id: 'user-id',
        email: 'user@example.com',
        role: {
          name: 'user',
        },
        account: { code: 'ACC123' },
      };
      const mockResult = {
        id: 'tx-id',
        type: 'withdraw',
        amount: 50,
      };

      mockAccountsService.withdraw.mockResolvedValue(mockResult);

      const result = await controller.withdraw(withdrawDto, mockUser);

      expect(mockAccountsService.withdraw).toHaveBeenCalledWith(
        'ACC123',
        withdrawDto,
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw ForbiddenException if user has no account', async () => {
      const withdrawDto: WithdrawDto = { value: 50 };
      const mockUser: JwtPayload = {
        id: 'user-id',
        email: 'user@example.com',
        role: {
          name: 'user',
        },
      };

      try {
        await controller.withdraw(withdrawDto, mockUser);
        fail('Expected ForbiddenException to be thrown');
      } catch (err: unknown) {
        const error = err as Error;
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('You not have account, please create one');
        expect(mockAccountsService.withdraw).not.toHaveBeenCalled();
      }
    });
  });

  describe('transfer', () => {
    it('should transfer money between accounts', async () => {
      const transferDto: TransferDto = { value: 50 };
      const mockUser: JwtPayload = {
        id: 'user-id',
        email: 'user@example.com',
        role: {
          name: 'user',
        },
        account: { code: 'SENDER123' },
      };
      const mockResult = {
        id: 'tx-id',
        type: 'transfer',
        amount: 50,
      };

      mockAccountsService.transfer.mockResolvedValue(mockResult);

      const result = await controller.transfer(
        'RECEIVER456',
        transferDto,
        mockUser,
      );

      expect(mockAccountsService.transfer).toHaveBeenCalledWith(
        'SENDER123',
        'RECEIVER456',
        transferDto,
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw ForbiddenException if user has no account', async () => {
      const transferDto: TransferDto = { value: 50 };
      const mockUser: JwtPayload = {
        id: 'user-id',
        email: 'user@example.com',
        role: {
          name: 'user',
        },
      };

      try {
        await controller.transfer('RECEIVER456', transferDto, mockUser);
        fail('Expected ForbiddenException to be thrown');
      } catch (err: unknown) {
        const error = err as Error;
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('You not have account, please create one');
        expect(mockAccountsService.transfer).not.toHaveBeenCalled();
      }
    });
  });

  describe('getStatement', () => {
    it('should return account statement', async () => {
      const filters: StatementFilterDto = {};
      const mockUser: JwtPayload = {
        id: 'user-id',
        email: 'user@example.com',
        role: {
          name: 'user',
        },
        account: { code: 'ACC123' },
      };
      const mockResult = {
        accountId: 'account-id',
        currentBalance: '100.00',
        transactions: [],
      };

      mockAccountsService.getAccountStatement.mockResolvedValue(mockResult);

      const result = await controller.getStatement(filters, mockUser);

      expect(mockAccountsService.getAccountStatement).toHaveBeenCalledWith(
        'ACC123',
        filters,
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw ForbiddenException if user has no account', async () => {
      const filters: StatementFilterDto = {};
      const mockUser: JwtPayload = {
        id: 'user-id',
        email: 'user@example.com',
        role: {
          name: 'user',
        },
      };

      try {
        await controller.getStatement(filters, mockUser);
        fail('Expected ForbiddenException to be thrown');
      } catch (err: unknown) {
        const error = err as Error;
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('You not have account, please create one');
        expect(mockAccountsService.getAccountStatement).not.toHaveBeenCalled();
      }
    });
  });

  describe('reverseTransaction', () => {
    it('should reverse a transaction', async () => {
      const mockResult = {
        id: 'tx-id',
        type: 'reversal',
      };

      mockAccountsService.reverseTransaction.mockResolvedValue(mockResult);

      const result = await controller.reverseTransaction('tx-id');

      expect(mockAccountsService.reverseTransaction).toHaveBeenCalledWith(
        'tx-id',
      );
      expect(result).toEqual(mockResult);
    });
  });
});
