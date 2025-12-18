// src/admin/dto/create-admin.dto.ts
import { 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    MaxLength, 
    MinLength, 
    Matches, 
    IsNumber, 
    IsOptional, 
    IsEnum 
} from "class-validator";
import { Type } from 'class-transformer';
import { Match } from "src/common/decorators/match.decorator";
import { StatusEnum } from "../constants/status.enum";

export class CreateAdminDto {

    // --- Fullname ---
    @IsNotEmpty({ message: 'Fullname is required.' })
    @IsString({ message: 'Fullname must be a string.' })
    @MaxLength(100, { message: 'Fullname must not exceed 100 characters.' })
    fullname: string;

    // --- Email ---
    @IsNotEmpty({ message: 'Email is required.' })
    @IsEmail({}, { message: 'Invalid email format. Please enter a valid email address.' })
    email: string;

    // --- Password ---
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string.' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(255, { message: 'Password must not exceed 255 characters' })
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character',
    })
    password: string;

    // --- Confirm Password ---
    @IsNotEmpty({ message: 'Confirm password is required' })
    @Match('password', { message: 'Passwords do not match' })
    confirmPassword: string;

    // --- Status (Missing/Optional) ---
    @IsOptional()
    @IsEnum(StatusEnum, {
        message: 'The status must be a valid status value.',
    })
    status?: StatusEnum;
}