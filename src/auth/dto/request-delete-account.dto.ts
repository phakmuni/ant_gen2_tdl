
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RequestDeleteAccountDto {
    @IsString()
    @IsNotEmpty({ message: 'Password is Require' })
    password: string;
}