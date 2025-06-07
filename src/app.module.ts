import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './roles/roles.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [UsersModule, DatabaseModule, RolesModule, AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
