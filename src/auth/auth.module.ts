// import { Generation } from 'src/generation/entities/generation.entity';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { OtpsModule } from 'src/otps/otps.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
// import { AlumniProfile } from 'src/alumni-profile/entities/alumni-profile.entity';
// import { Department } from 'src/department/entities/department.entity';
import { ResetPasswordToken } from 'src/reset-password-token/entities/reset-password-token.entity';
import { EmailVerificationToken } from 'src/email-verification-token/entities/email-verification-token.entity';

@Module({
  imports: [
    ConfigModule,
    TokensModule,
    UsersModule,
    TypeOrmModule.forFeature([User, Role, ResetPasswordToken, EmailVerificationToken]),
    OtpsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
