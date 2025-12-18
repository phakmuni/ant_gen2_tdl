// src/user/dto/create-user.dto.ts
import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MaxLength, 
  MinLength, 
  IsOptional, 
  Matches, 
  IsNumber,
  IsUrl 
} from "class-validator";

export class CreateUserDto {

  // --- Fullname (Required) ---

  @IsNotEmpty({ message: 'Fullname is required.' })
  @IsString({ message: 'Fullname must be a string.' })
  @MaxLength(100, { message: 'Fullname must not exceed 100 characters.' })
  fullname: string;

  // --- Email (Required) ---

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Invalid email format. Please enter a valid email address.' })
  // @Matches(/@(gmail|googlemail)\.com$/, { // Keep this commented or uncomment based on business logic
  //   message: 'You can only register with a Gmail or Googlemail address.',
  // })
  email: string;

  

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @MaxLength(255, { message: 'Password must not exceed 255 characters.' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must contain at least one uppercase letter, one number, and one special character.',
  })
  password: string;

  @IsNotEmpty({ message: 'Role ID is required.' })
  @IsNumber({}, { message: 'Role ID must be a number.' })
  roleId: number;
}