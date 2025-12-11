import { IsIn, IsOptional, IsString } from "class-validator";
import { FindQueryDto } from "./find-query.dto";
import { Transform } from "class-transformer";


export class SortQueryDto extends FindQueryDto{
    @IsOptional()
    @IsString({message: "Sort by must be a string"})
    sortBy?: string;

    @IsOptional()
    @IsIn(['ASC', 'DESC'], {message: "Sort direction must be ASC or DESC"})
    @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase() : value))
    sortDir? : 'ASC' | 'DESC' = 'ASC'
}