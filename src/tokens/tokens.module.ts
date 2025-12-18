import { Module } from '@nestjs/common';
import { TokenService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Token,User]),
    ],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokensModule {}
