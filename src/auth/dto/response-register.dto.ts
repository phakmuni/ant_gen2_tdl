import { PartialType } from "@nestjs/mapped-types";
import { ResponseUserDto } from "src/users/dto/response-user.dto";



export class ResponseRegisterDto extends PartialType(ResponseUserDto){

}