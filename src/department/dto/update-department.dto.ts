
import { 
  IsNotEmpty, 
  IsString, 
  MaxLength, 
  IsOptional 
} from 'class-validator';
export class UpdateDepartmentDto {

    @IsOptional()
    @IsString({
    message: 'The category name must be a string.',
    })
    @MaxLength(100, {
    message: 'The category name must not exceed 100 characters.',
    })
    name: string;


    @IsOptional() // Field is optional in the request body
    @IsString({
    message: 'The category description must be a string.',
    })
    @IsNotEmpty({
    message: 'If provided, the category description cannot be an empty string.',
    }) 
    @MaxLength(500, {
    message: 'The category description must not exceed 500 characters.',
    })
    description?: string;

}