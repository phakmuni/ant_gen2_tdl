

import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, IsBoolean, IsOptional, Matches, IsNumber } from "class-validator";
import { Match } from "src/common/decorators/match.decorator";


export class RequestRegisterDto {

    @IsString({ message: 'Fullname must be a string.' })
    @IsNotEmpty({ message: 'Fullname is required.' })
    @MaxLength(100, { message: 'Fullname must not exceed 100 characters.' })
    fullname: string;

    @IsEmail({}, { message: 'Invalid email format.' })
    @IsNotEmpty({ message: 'Email is required.' })
    // @Matches(/@(gmail|googlemail)\.com$/, {
    //  message: 'You can only send OTPs to a Gmail or Googlemail address.',
    // })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(255, { message: 'Password must not exceed 255 characters' })
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message:
        'Password must contain at least one uppercase letter, one number, and one special character',
    })
    password: string;

    @IsNotEmpty({ message: 'Confirm password is required' })
    @Match('password', { message: 'Passwords do not match' })
    confirmPassword: string;

    @IsNotEmpty({ message: 'Generation ID is required.' })
    @IsNumber({}, { message: 'Generation ID must be a number.' })
    generationId: number;

    @IsNotEmpty({ message: 'Department ID is required.' })
    @IsNumber({}, { message: 'Department ID must be a number.' })
    departmentId: number;
}