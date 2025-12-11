import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RequestResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 255, { message: 'Password must be at least 8 characters long.' })
    // Requires at least one uppercase letter, one lowercase letter, and one number
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
    })
    newPassword: string;
}