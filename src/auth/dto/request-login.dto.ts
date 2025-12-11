
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class RequestLoginDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MaxLength(255, { message: 'Password must not exceed 255 characters' })
  password: string;
}
