import { Expose, Type } from "class-transformer";
import { ResponseUserDto } from "src/users/dto/response-user.dto";



export class ResponseLoginDto {

    @Expose()
    @Type(() => ResponseUserDto)
    user: ResponseUserDto;
    @Expose()
    token : string;
    
}