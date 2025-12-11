
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RequestChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'New password must be at least 8 characters long.' })
    newPassword: string;
}