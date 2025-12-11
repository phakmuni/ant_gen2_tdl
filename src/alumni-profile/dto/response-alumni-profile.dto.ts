import { Expose, Transform, Type } from "class-transformer";
import { ResponseDepartmentDto } from "src/department/dto/response-department.dto";
import { Department } from "src/department/entities/department.entity";
import { ResponseGenerationDto } from "src/generation/dto/response-generation.dto";
import { StatusEnum } from "src/users/constants/status.enum";


export class ResponseAluminProfileDto {
    @Expose()
    fullname: string;

    @Expose()
    @Transform(({ value }) => {
    if (!value) return null;
    const host = process.env.HOST || 'http://localhost:3000';
    const uploadsPath = `/uploads/avatars/${value}`;
    return host.replace(/\/$/, '') + uploadsPath;
    })
    avatar: string;

    @Expose()
    @Type(() =>  ResponseDepartmentDto)
    department: ResponseDepartmentDto;

    @Expose()
    @Type(() => ResponseGenerationDto)
    generation: ResponseGenerationDto;

    
    @Expose()
    phone: number;
    @Expose()
    bio: string;
    @Expose()
    currentJob: string;

    @Expose()
    status: StatusEnum;
}