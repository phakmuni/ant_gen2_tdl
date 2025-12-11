

import { RoleEnum } from 'src/roles/constants/role.enum';
import { Role } from 'src/roles/entities/role.entity';
import { DataSource } from 'typeorm';

export class RoleSeeder {
  constructor(private dataSource: DataSource) {}

  async seed() {
    const roleRepo = this.dataSource.getRepository(Role);

    for (const roleName of Object.values(RoleEnum)) {
      const existing = await roleRepo.exists({where: {name: roleName} });
      if (!existing) {
        const role = roleRepo.create({ name: roleName });
        await roleRepo.save(role);
        console.log(`Seeded role: ${roleName}`);
      } else {
        console.log(`Role already exists: ${roleName}`);
      }
    }
  }
}
