import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
  ) {}

  async storeToken(user: User, token: string) {
    const newToken = this.tokenRepo.create({ user, token });
    return this.tokenRepo.save(newToken);
  }

  async deleteToken(token: string) {
    return this.tokenRepo.delete({ token });
  }

  async findToken(token: string) {
    return this.tokenRepo.findOne({ where: { token } });
  }

  // TODO: CronJob clear expired token

  async deleteAllTokensForUser(userId: number) {
    await this.tokenRepo.delete({ user: {id: userId} })
  }
}
