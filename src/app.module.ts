import { Module } from '@nestjs/common';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AlumniProfileModule } from './alumni-profile/alumni-profile.module';
import { AuthModule } from './auth/auth.module';
import { OtpsModule } from './otps/otps.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './configs/typeorm.config';
import * as Joi from "joi";
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { GenerationModule } from './generation/generation.module';
import { DepartmentModule } from './department/department.module';
import { ResetPasswordTokenModule } from './reset-password-token/reset-password-token.module';
import { EmailVerificationTokenModule } from './email-verification-token/email-verification-token.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          limit: 5,
          ttl: 60_000,
        },
      ],
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal : true,
      validationSchema: Joi.object({
        // == Server
        PORT: Joi.number().required(),
        HOST: Joi.string().required(),
        PREFIX: Joi.string().required(),
        VERSION: Joi.string().required(),
        // == Database
        DB_TYPE: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        // == Default user
        DEFAULT_FULLNAME: Joi.string().required(),
        DEFAULT_EMAIL: Joi.string().required(),
        // == Jwt
        SECRET_KEY: Joi.string().required(),
      })
    }),
    UsersModule, TokensModule, RolesModule, RolesModule, AlumniProfileModule, AuthModule, OtpsModule, GenerationModule, DepartmentModule, ResetPasswordTokenModule, EmailVerificationTokenModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
