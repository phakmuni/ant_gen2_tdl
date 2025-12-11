
// src/otp/dto/send-otp.dto.ts

import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty({ 
    message: 'Email is required. Please provide an email address.',
  })
  @IsEmail({}, { 
    message: 'Invalid email format. Please enter a correct email address.',
  })
  // @Matches(/@(gmail|googlemail)\.com$/, {
  //   message: 'You can only send OTPs to a Gmail or Googlemail address.',
  // })
  email: string;
}