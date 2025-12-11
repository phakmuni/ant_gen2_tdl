

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestForgetPasswordDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}