import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { Role } from 'src/roles/entities/role.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role])
    ],
  providers: [UserService],
  exports: [
    UserService
  ],
  controllers: [UsersController]
})
export class UsersModule {}
