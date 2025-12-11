import { IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationQueryDto } from "./pagination-query.dto";


export class FindQueryDto extends PaginationQueryDto{
    @IsOptional()
    @IsString({message : "Search must be a string."})
    @MaxLength(100, {message: "Search cannot be exceed 100 characters"})
    search?: string;
}

