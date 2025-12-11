import { Module } from '@nestjs/common';
import { OtpsController } from './otps.controller';
import { OtpsService } from './otps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { User } from 'src/users/entities/user.entity';
import { AlumniProfile } from 'src/alumni-profile/entities/alumni-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp,User, AlumniProfile])
  ],
  controllers: [OtpsController],
  providers: [OtpsService]
})
export class OtpsModule {}
