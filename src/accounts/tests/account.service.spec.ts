import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from '../accounts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Accounts } from '../entities/accounts.entity';
import { Transaction } from '../entities/transactions.entity';
import { Repository } from 'typeorm';
import { CreateAccountsDto } from '../dto/create.accounts.dto';
import { NotFoundException } from '@nestjs/common';
import { WithdrawDto } from '../dto/withdraw.account.dto';
import { DepositDto } from '../dto/deposit.account.dto';
import { TransferDto } from '../dto/transfer.account.dto';
import { TransactionType } from '../entities/transactions.enum';
import { StatementFilterDto } from '../entities/statement.account.dto';

describe('AccountsService', () => {
  let service: AccountsService;
  let accountsRepository: Repository<Accounts>;
  let transactionsRepository: Repository<Transaction>;

  const mockAccountsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockTransactionsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getRepositoryToken(Accounts),
          useValue: mockAccountsRepository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionsRepository,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    accountsRepository = module.get<Repository<Accounts>>(getRepositoryToken(Accounts));
    transactionsRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new account', async () => {
      const createAccountDto: CreateAccountsDto = {
        userId: 'user-id',
      };

      const mockAccount = {
        id: 'account-id',
        code: 'ACC123',
        balance: '0.00',
        active: true,
        user: { id: 'user-id' },
      };

      mockAccountsRepository.create.mockReturnValue(mockAccount);
      mockAccountsRepository.save.mockResolvedValue(mockAccount);
      mockAccountsRepository.findOneBy.mockResolvedValue(null); // No existing account with the same code

      const result = await service.create(createAccountDto);

      expect(mockAccountsRepository.create).toHaveBeenCalled();
      expect(mockAccountsRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockAccount);
    });
  });

  describe('findAll', () => {
    it('should return an array of accounts', async () => {
      const mockAccounts = [
        { id: 'account-id-1', code: 'ACC123', balance: '100.00' },
        { id: 'account-id-2', code: 'ACC456', balance: '200.00' },
      ];

      mockAccountsRepository.find.mockResolvedValue(mockAccounts);

      const result = await service.findAll();

      expect(mockAccountsRepository.find).toHaveBeenCalled();
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

      mockAccountsRepository.findOne.mockResolvedValue(mockAccount);

      const result = await service.findOne('ACC123');

      expect(mockAccountsRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'ACC123' },
        relations: ['user']
      });
      expect(result).toEqual(mockAccount);
    });

    it('should throw NotFoundException if account not found', async () => {
      mockAccountsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('NONEXISTENT')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deposit', () => {
    it('should deposit money into an account', async () => {
      const depositDto: DepositDto = { value: 100 };
      const mockAccount = {
        id: 'account-id',
        code: 'ACC123',
        balance: '100.00',
      };

      mockAccountsRepository.findOne.mockResolvedValue(mockAccount);
      mockAccountsRepository.save.mockImplementation((account) => Promise.resolve(account));
      mockTransactionsRepository.create.mockReturnValue({});
      mockTransactionsRepository.save.mockResolvedValue({});

      const result = await service.deposit('ACC123', depositDto);

      expect(mockAccountsRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'ACC123' },
        relations: ['user']
      });
      expect(mockAccountsRepository.save).toHaveBeenCalled();
      expect(mockTransactionsRepository.create).toHaveBeenCalled();
      expect(mockTransactionsRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if account not found', async () => {
      const depositDto: DepositDto = { value: 100 };

      mockAccountsRepository.findOne.mockResolvedValue(null);

      await expect(service.deposit('NONEXISTENT', depositDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('withdraw', () => {
    it('should withdraw money from an account', async () => {
      const withdrawDto: WithdrawDto = { value: 50 };
      const mockAccount = {
        id: 'account-id',
        code: 'ACC123',
        balance: '100.00',
      };

      mockAccountsRepository.findOne.mockResolvedValue(mockAccount);
      mockAccountsRepository.save.mockImplementation((account) => Promise.resolve(account));
      mockTransactionsRepository.create.mockReturnValue({});
      mockTransactionsRepository.save.mockResolvedValue({});

      const result = await service.withdraw('ACC123', withdrawDto);

      expect(mockAccountsRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'ACC123' },
        relations: ['user']
      });
      expect(mockAccountsRepository.save).toHaveBeenCalled();
      expect(mockTransactionsRepository.create).toHaveBeenCalled();
      expect(mockTransactionsRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if account not found', async () => {
      const withdrawDto: WithdrawDto = { value: 50 };

      mockAccountsRepository.findOne.mockResolvedValue(null);

      await expect(service.withdraw('NONEXISTENT', withdrawDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw error if insufficient funds', async () => {
      const withdrawDto: WithdrawDto = { value: 150 };
      const mockAccount = {
        id: 'account-id',
        code: 'ACC123',
        balance: '100.00',
      };

      mockAccountsRepository.findOne.mockResolvedValue(mockAccount);

      await expect(service.withdraw('ACC123', withdrawDto)).rejects.toThrow();
    });
  });

  describe('transfer', () => {
    it('should transfer money between accounts', async () => {
      const transferDto: TransferDto = { value: 50 };
      const senderAccount = {
        id: 'sender-id',
        code: 'SENDER123',
        balance: '100.00',
      };
      const receiverAccount = {
        id: 'receiver-id',
        code: 'RECEIVER456',
        balance: '0.00',
      };

      mockAccountsRepository.findOne.mockImplementation((params) => {
        if (params.where.code === 'SENDER123') return senderAccount;
        if (params.where.code === 'RECEIVER456') return receiverAccount;
        return null;
      });

      mockAccountsRepository.save.mockImplementation((account) => Promise.resolve(account));
      mockTransactionsRepository.create.mockReturnValue({});
      mockTransactionsRepository.save.mockResolvedValue({});

      const result = await service.transfer('SENDER123', 'RECEIVER456', transferDto);

      expect(mockAccountsRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockAccountsRepository.save).toHaveBeenCalledTimes(2);
      expect(mockTransactionsRepository.create).toHaveBeenCalledTimes(2);
      expect(mockTransactionsRepository.save).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if sender account not found', async () => {
      const transferDto: TransferDto = { value: 50 };

      mockAccountsRepository.findOne.mockResolvedValue(null);

      await expect(service.transfer('NONEXISTENT', 'RECEIVER456', transferDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if receiver account not found', async () => {
      const transferDto: TransferDto = { value: 50 };
      const senderAccount = {
        id: 'sender-id',
        code: 'SENDER123',
        balance: '100.00',
      };

      mockAccountsRepository.findOne.mockImplementation((params) => {
        if (params.where.code === 'SENDER123') return senderAccount;
        return null;
      });

      await expect(service.transfer('SENDER123', 'NONEXISTENT', transferDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw error if insufficient funds', async () => {
      const transferDto: TransferDto = { value: 150 };
      const senderAccount = {
        id: 'sender-id',
        code: 'SENDER123',
        balance: '100.00',
      };
      const receiverAccount = {
        id: 'receiver-id',
        code: 'RECEIVER456',
        balance: '0.00',
      };

      mockAccountsRepository.findOne.mockImplementation((params) => {
        if (params.where.code === 'SENDER123') return senderAccount;
        if (params.where.code === 'RECEIVER456') return receiverAccount;
        return null;
      });

      await expect(service.transfer('SENDER123', 'RECEIVER456', transferDto)).rejects.toThrow();
    });
  });

  describe('getAccountStatement', () => {
    it('should return account statement', async () => {
      const filters: StatementFilterDto = {};
      const mockAccount = {
        id: 'account-id',
        code: 'ACC123',
        balance: '100.00',
      };
      const mockTransactions = [
        {
          id: 'tx-1',
          type: TransactionType.DEPOSIT,
          amount: 100,
          before_balance: 0,
          after_balance: 100,
          createdAt: new Date(),
        },
      ];

      mockAccountsRepository.findOneBy.mockResolvedValue(mockAccount);
      mockTransactionsRepository.createQueryBuilder().getMany.mockResolvedValue(mockTransactions);

      const result = await service.getAccountStatement('ACC123', filters);

      expect(mockAccountsRepository.findOneBy).toHaveBeenCalledWith({ code: 'ACC123' });
      expect(mockTransactionsRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toHaveProperty('accountId', 'account-id');
      expect(result).toHaveProperty('currentBalance', '100.00');
      expect(result).toHaveProperty('transactions');
    });

    it('should throw NotFoundException if account not found', async () => {
      const filters: StatementFilterDto = {};

      mockAccountsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getAccountStatement('NONEXISTENT', filters)).rejects.toThrow(NotFoundException);
    });
  });

  describe('reverseTransaction', () => {
    it('should reverse a transaction', async () => {
      const mockTransaction = {
        id: 'tx-id',
        type: TransactionType.TRANSFER,
        amount: 50,
        from_account_id: 'sender-id',
        to_account_id: 'receiver-id',
      };
      const senderAccount = {
        id: 'sender-id',
        code: 'SENDER123',
        balance: '50.00',
      };
      const receiverAccount = {
        id: 'receiver-id',
        code: 'RECEIVER456',
        balance: '50.00',
      };

      mockTransactionsRepository.findOne.mockResolvedValue(mockTransaction);
      mockAccountsRepository.findOne.mockImplementation((params) => {
        if (params.where.id === 'sender-id') return senderAccount;
        if (params.where.id === 'receiver-id') return receiverAccount;
        return null;
      });

      mockAccountsRepository.save.mockImplementation((account) => Promise.resolve(account));
      mockTransactionsRepository.create.mockReturnValue({});
      mockTransactionsRepository.save.mockResolvedValue({});

      const result = await service.reverseTransaction('tx-id');

      expect(mockTransactionsRepository.findOne).toHaveBeenCalled();
      expect(mockAccountsRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockAccountsRepository.save).toHaveBeenCalledTimes(2);
      expect(mockTransactionsRepository.create).toHaveBeenCalledTimes(2);
      expect(mockTransactionsRepository.save).toHaveBeenCalledTimes(3);
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if transaction not found', async () => {
      mockTransactionsRepository.findOne.mockResolvedValue(null);

      await expect(service.reverseTransaction('NONEXISTENT')).rejects.toThrow(NotFoundException);
    });
  });
});
