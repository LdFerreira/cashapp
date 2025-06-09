import { NestFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { Users } from './src/users/entities/users.entity';
import { Roles } from './src/roles/entities/roles.entity';
import { SeederModule } from './src/seed/seed.module';
import { SeederService } from './src/seed/seed.service';
import { dataSourceOptions } from './src/database/database.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          ...dataSourceOptions,
        };
      },
    }),
    TypeOrmModule.forFeature([Users, Roles]),
    SeederModule,
  ],
})
class SeedAppModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedAppModule);
  const seeder = app.get(SeederService);
  await seeder.seed();
  await app.close();
}

bootstrap();