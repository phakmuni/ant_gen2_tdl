
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { ResponseRoleDto } from "src/roles/dto/response-role.dto";
// import { ResponseDepartmentDto } from "src/department/dto/response-department.dto";
// import { ResponseAluminProfileDto } from "src/alumni-profile/dto/response-alumni-profile.dto";

export class ResponseNoteDto {
    @Expose()
    id: number;

    @Expose()
    title:string;

    @Expose()
    content:string;

    @Expose()
    isCompleted:boolean;

    @Expose()
    createdAt:string;

    @Expose()
    updatedAt:string;
}
