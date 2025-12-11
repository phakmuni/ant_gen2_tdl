import { Expose, Type } from "class-transformer";
import { ResponseGenerationDto } from "./response-generation.dto";
import { ResponseDepartmentDto } from "src/department/dto/response-department.dto";


export class ResponseGenerationDetailDto extends ResponseGenerationDto {
    
    @Expose()
    startYear: number;
    
    @Expose()
    endYear: number;
    
    @Expose()
    description: string;
    
    @Expose()
    @Type(() => ResponseDepartmentDto)
    department: ResponseDepartmentDto;

}