import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumniProfile } from 'src/alumni-profile/entities/alumni-profile.entity';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, AlumniProfile])],
  providers: [],
})
export class SeedersModule {}
