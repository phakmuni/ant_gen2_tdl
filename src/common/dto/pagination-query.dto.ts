
// replace pagination.dto.ts

import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({message : "Page must be an integer"})
  @Min(1, {message : "Page must be at least 1."})
  _page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({message : "limit must be an integer"})
  @Min(1, {message : "Limit must be at least 1."})
  @Max(100, {message: "Limit cannot exceed 100 length."})
  _per_page?: number = 10;
}

