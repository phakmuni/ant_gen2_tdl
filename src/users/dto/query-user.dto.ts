import { IsEnum, IsIn, IsOptional } from "class-validator";
import { SortQueryDto } from "src/common/dto/sort-query.dto";
import { StatusEnum } from "../constants/status.enum";



export class QueryUserDto extends SortQueryDto {
    
    @IsOptional()
    @IsIn(['email','id', 'createdAt'], { message: "SortBy must be either 'id' or 'title' or 'createdAt' or 'email'." })
    sortBy?: 'email' | 'createdAt' | 'id' | 'email' = 'id';
    
    @IsOptional()
    @IsEnum(StatusEnum, {
        message: 'The status must be a valid user status.' 
        // You can customize the message further by listing allowed values if needed.
    })
    status?: StatusEnum;
}