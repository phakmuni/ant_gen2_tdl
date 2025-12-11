

// src/otp/dto/verify-otp.dto.ts
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  // --- Email Validation ---

  @IsNotEmpty({
    message: 'The email field is required. Please provide an email address.',
  })
  @IsEmail({}, {
    message: 'The email format is invalid. Please enter a correct email address.',
  })
  // Assuming you only allow Gmail/Googlemail domains as per our previous context
  // @Matches(/@(gmail|googlemail)\.com$/, {
  //   message: 'Only Gmail or Googlemail addresses are accepted for verification.',
  // })
  email: string;

  // --- OTP Code Validation ---

  @IsNotEmpty({
    message: 'The OTP code is required.',
  })
  @IsString({
    message: 'The OTP code must be provided as a string.',
  })
  // Assumes a 6-digit OTP code, which is standard. Adjust if your code length differs.
  @Length(6, 6, {
    message: 'The OTP code must be exactly 6 characters long.',
  })
  code: string;
}