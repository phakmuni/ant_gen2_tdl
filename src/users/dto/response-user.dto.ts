
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { ResponseRoleDto } from "src/roles/dto/response-role.dto";
import { StatusEnum } from "../constants/status.enum";
// import { ResponseDepartmentDto } from "src/department/dto/response-department.dto";
// import { ResponseAluminProfileDto } from "src/alumni-profile/dto/response-alumni-profile.dto";

export class ResponseUserDto {
    @Expose()
    id: number;

    @Expose()
    fullname: string;
    
    @Expose()
    email: string;
    @Expose()
    isVerifyEmail: boolean;

    // @Expose()
    // @Type(() => ResponseAluminProfileDto)
    // profile : ResponseAluminProfileDto;
    @Expose()
    @Transform(({ value }) => {
    if (!value) return null;
    const host = process.env.HOST || 'http://localhost:3000';
    const uploadsPath = `/uploads/avatars/${value}`;
    return host.replace(/\/$/, '') + uploadsPath;
    })
    avatar: string;

    @Expose()
    status: StatusEnum;

    @Expose()
    @Type(() => ResponseRoleDto)
    role: ResponseRoleDto;

    @Expose({ name: 'createdAt' })
    registeredAt: string;
}
