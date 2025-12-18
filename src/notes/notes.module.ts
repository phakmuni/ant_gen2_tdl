import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Note } from './entities/note.entity';
import { UserService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Note,
    ]),
    UsersModule
  ],
  controllers: [NotesController],
  providers: [NotesService],
  exports:[NotesService]
})
export class NotesModule {}
