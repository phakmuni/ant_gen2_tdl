import { Expose, Type } from "class-transformer";
import { ResponseGenerationDto } from "src/generation/dto/response-generation.dto";


export class ResponseDepartmentDto {

    @Expose()
    id: number;
    @Expose()
    name: string;

}