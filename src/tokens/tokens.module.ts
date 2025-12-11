import { Module } from '@nestjs/common';
import { TokenService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Token]),
    ],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokensModule {}
