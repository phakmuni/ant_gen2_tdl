import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { RoleSeeder } from './role.seeder';
import { UserAdminSeeder } from './user.admin.seed';
import {  ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const config = app.get(ConfigService);
  const roleSeeder = new RoleSeeder(dataSource);
  const adminSeeder = new UserAdminSeeder(dataSource, config);
  await roleSeeder.seed();
  await adminSeeder.seed();
  await app.close();
}

bootstrap();
