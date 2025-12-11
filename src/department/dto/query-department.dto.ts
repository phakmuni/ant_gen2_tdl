



import { IsIn, IsOptional } from "class-validator";
import { SortQueryDto } from "../../common/dto/sort-query.dto";



export class QueryDepartmentDto extends SortQueryDto {
    @IsOptional()
    @IsIn(['name', 'id','createdAt'], { message: "SortBy must be either 'id', 'name' or 'createdAt'" })
    sortBy?: 'name' | 'createdAt' | 'id' = 'id';
    
}