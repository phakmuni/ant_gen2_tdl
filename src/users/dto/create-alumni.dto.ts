// src/alumni/dto/create-alumni.dto.ts
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
import { Type } from 'class-transformer'; // Needed for phone number conversion
import { Match } from "src/common/decorators/match.decorator";
import { StatusEnum } from "../constants/status.enum";

export class CreateAlumniDto {

    // --- Fullname ---
    @IsNotEmpty({ message: 'Fullname is required.' })
    @IsString({ message: 'Fullname must be a string.' })
    @MaxLength(100, { message: 'Fullname must not exceed 100 characters.' })
    fullname: string;

    // --- Email ---
    @IsNotEmpty({ message: 'Email is required.' })
    @IsEmail({}, { message: 'Invalid email format. Please enter a valid email address.' })
    // Domain match logic omitted as per comment
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

    // --- Generation ID (Required) ---
    @IsNotEmpty({ message: 'Generation ID is required.' })
    @Type(() => Number) // Ensure string input (from JSON/form) is converted to a number
    @IsNumber({}, { message: 'Generation ID must be a number.' })
    generationId: number;

    // --- Department ID (Required) ---
    @IsNotEmpty({ message: 'Department ID is required.' })
    @Type(() => Number) // Ensure string input (from JSON/form) is converted to a number
    @IsNumber({}, { message: 'Department ID must be a number.' })
    departmentId: number;

    // --- Phone Number (Missing/Required) ---
    // NOTE: For signup, phone is often required, but I'm adding @IsOptional
    // as it's not marked required by @IsNotEmpty
    @IsOptional() 
    @Type(() => Number) // Convert incoming string/number to number type
    @IsNumber({}, { message: 'Phone number must be a valid number.' })
    phone?: number;

    // --- Bio (Missing/Optional) ---
    @IsOptional()
    @IsString({ message: 'Bio must be a string.' })
    @IsNotEmpty({ message: 'Bio cannot be an empty string if provided.' })
    @MaxLength(500, { message: 'Bio must not exceed 500 characters.' })
    bio?: string;

    // --- Current Job (Missing/Optional) ---
    @IsOptional()
    @IsString({ message: 'Current job must be a string.' })
    @IsNotEmpty({ message: 'Current job cannot be an empty string if provided.' })
    @MaxLength(100, { message: 'Current job must not exceed 100 characters.' })
    currentJob?: string;

    // --- Status (Missing/Optional) ---
    // NOTE: Status is typically set by the backend on creation, but if the client 
    // can specify it, it must be a valid enum value.
    @IsOptional()
    @IsEnum(StatusEnum, {
        message: 'The status must be a valid status value.',
    })
    status?: StatusEnum;
}