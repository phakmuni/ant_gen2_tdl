// src/user/dto/update-user-profile.dto.ts
import { 
  IsEmail, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  MaxLength, 
  IsUrl,
  IsPhoneNumber, // Used for phone format validation if enabled
  IsNumber
} from 'class-validator';
import { Type } from 'class-transformer'; // Needed for numeric query/body parameters

export class UpdateUserProfileDto {
  // --- Fullname (Optional) ---
  
  @IsOptional()
  @IsString({ message: 'Full name must be a string.' })
  // Should only validate non-empty if it is present
  @IsNotEmpty({ message: 'Full name cannot be an empty string if provided.' }) 
  @MaxLength(50, { message: 'Full name must not exceed 50 characters.' })
  fullname?: string;
  
  // --- Phone Number (Optional) ---
  
  @IsOptional()
  @IsString({ message: 'Phone number must be a string.' })
  @IsNotEmpty({ message: 'Phone number cannot be an empty string if provided.' })
  // If you use @IsPhoneNumber, remember to install libphonenumber-js and pass a region code:
  // @IsPhoneNumber('US', { message: 'Phone number format is invalid.' })
  @MaxLength(50, { message: 'Phone number must not exceed 50 characters.' })
  phone?: string; 
  
  // --- Bio (Optional) ---
  
  @IsOptional()
  @IsString({ message: 'Bio must be a string.' })
  @IsNotEmpty({ message: 'Bio cannot be an empty string if provided.' })
  @MaxLength(500, { message: 'Bio must not exceed 500 characters.' })
  bio?: string;

  // --- Current Job (Optional) ---
  
  @IsOptional()
  @IsString({ message: 'Current job must be a string.' })
  @IsNotEmpty({ message: 'Current job cannot be an empty string if provided.' })
  @MaxLength(100, { message: 'Current job must not exceed 100 characters.' })
  currentJob?: string;

  // --- Department ID (Optional) ---
  
  @IsOptional()
  // Ensure string input (from forms/query) is converted to a number
  @Type(() => Number) 
  @IsNumber({}, { message: 'Department ID must be a number.' })
  departmentId?: number;

  // --- Generation ID (Optional) ---
  
  @IsOptional()
  // Ensure string input (from forms/query) is converted to a number
  @Type(() => Number)
  @IsNumber({}, { message: 'Generation ID must be a number.' })
  generationId?: number;
}