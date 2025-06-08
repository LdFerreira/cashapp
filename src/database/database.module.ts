import { Module } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities/users.entity';
import { Roles } from '../roles/entities/roles.entity';
import { Accounts } from '../accounts/entities/accounts.entity';
import { Transaction } from '../accounts/entities/transactions.entity';
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'cashapp',
  entities: [Users, Roles, Accounts, Transaction],
  synchronize: true, //Sincronizar com entidades
};
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          ...dataSourceOptions,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
