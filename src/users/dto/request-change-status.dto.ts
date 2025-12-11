import { IsEnum, IsNotEmpty } from "class-validator";
import { StatusEnum } from "../constants/status.enum";



export class RequestChangeStatusDto{

    @IsNotEmpty({
        message: 'The status field is required to change the status.',
    })
    @IsEnum(StatusEnum, {
        message: 'The status must be a valid user status.' 
        // You can customize the message further by listing allowed values if needed.
    })
    status: StatusEnum;
}