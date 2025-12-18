

import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Token } from 'src/tokens/entities/token.entity';
import { Otp } from 'src/otps/entities/otp.entity';
import { ResetPasswordToken } from 'src/reset-password-token/entities/reset-password-token.entity';
import { EmailVerificationToken } from 'src/email-verification-token/entities/email-verification-token.entity';
import { Note } from 'src/notes/entities/note.entity';


export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'mysql',
    host: config.get('DB_HOST'),
    port: config.get<number>('DB_PORT'),
    username: config.get('DB_USER'),
    password: config.get('DB_PASSWORD'),
    database: config.get('DB_NAME'),
    entities: [User, Role, Token, Otp, ResetPasswordToken, EmailVerificationToken,Note],
    synchronize: config.get<string>("NODE_ENV") != "production",
    logging: config.get<string>("NODE_ENV") != "production",
  }),
}