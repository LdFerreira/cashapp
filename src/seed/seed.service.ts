import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from '../users/entities/users.entity';
import { Roles } from '../roles/entities/roles.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {}

  async seed(): Promise<void> {
    // Cria role admin se não existir
    let adminRole = await this.rolesRepository.findOne({
      where: { name: 'admin' },
    });

    if (!adminRole) {
      adminRole = this.rolesRepository.create({ name: 'admin' });
      await this.rolesRepository.save(adminRole);
      console.log('🔐 Role admin criada.');
    }

    // Cria usuário admin se não existir
    const existingAdmin = await this.usersRepository.findOne({
      where: { email: 'admin@admin.com' },
    });

    if (!existingAdmin) {
      const password = await bcrypt.hash('admin123', 10);

      const adminUser = this.usersRepository.create({
        name: 'Admin',
        email: 'admin@admin.com',
        password,
        role: adminRole,
        birthdate: '1990-01-01',
      });

      await this.usersRepository.save(adminUser);
      console.log('👤 Usuário admin criado com sucesso.');
    } else {
      console.log('⚠️ Usuário admin já existe.');
    }
  }
}
