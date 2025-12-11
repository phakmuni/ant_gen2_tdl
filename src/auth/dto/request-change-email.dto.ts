import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RequestChangeEmailDto {
  @IsNotEmpty({ message: 'New email is required.' })
  @MaxLength(100, { message: 'Email must not exceed 100 characters.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  newEmail: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters.' })
  password: string;
}
