import { Controller, Post, Body } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { Throttle } from '@nestjs/throttler';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('otp')
export class OtpsController {
  constructor(private readonly otpService: OtpsService) {}

  @Post('send')
  @Throttle({
    default: {
      limit: 2,      // 3 requests
      ttl: 60_000,   // per 60 seconds
    },
  })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.otpService.generateOtp(dto.email);
  }

  @Post('verify')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto.email, dto.code);
  }

  // TODO: CronJob clear expiration and used token
  
}