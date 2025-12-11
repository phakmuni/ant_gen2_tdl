import { Expose, Type } from "class-transformer";
import { ResponseDepartmentDto } from "./response-department.dto";
import { ResponseGenerationDetailDto } from "src/generation/dto/response-generation-detail.dto";



export class ResponseDepartmentDetailDto extends ResponseDepartmentDto {    
    @Expose()
    description: string
    @Expose()
    createdAt : Date;
    @Expose()
    updatedAt: Date;
    @Expose()
    @Type(() => ResponseGenerationDetailDto)
    generations: ResponseGenerationDetailDto[];
}