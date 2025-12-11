

import { Exclude, Expose } from "class-transformer";
import { User } from "src/users/entities/user.entity";

export class ResponseRoleDto {
    @Expose()
    id : number;
    @Expose()
    name : string;
    @Exclude()
    users: User[];
}