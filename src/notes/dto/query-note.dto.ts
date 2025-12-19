import { IsBoolean, IsEnum, IsIn, IsOptional } from "class-validator";
import { SortQueryDto } from "src/common/dto/sort-query.dto";



export class QueryNoteDto extends SortQueryDto {
    
    @IsOptional()
    @IsIn(['id', 'createdAt','title'], { message: "SortBy must be either 'id' or 'title' or 'createdAt'" })
    sortBy?: 'title' | 'createdAt'|'updatedAt' | 'id' = 'id';
    
    @IsOptional()
    @IsBoolean({message:"isCompleted note must be a boolean"})
    isCompleted?:boolean;
}