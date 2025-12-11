import { IsNotEmpty, IsString, MaxLength, IsNumber, IsOptional } from "class-validator";

export class CreateGenerationDto {
    
    @IsString({ message: "Generation name must be a string." })
    @IsNotEmpty({ message: "Generation name is required." })
    @MaxLength(100, { message: "Generation name must not exceed 100 characters." })
    name: string;

    @IsNumber({}, { message: "Start year must be a number." })
    @IsNotEmpty({ message: "Start year is required." })
    startYear: number;

    @IsNumber({}, { message: "End year must be a number." })
    @IsNotEmpty({ message: "End year is required." })
    endYear: number;

    @IsOptional()
    @IsString({ message: "Description must be a string." })
    @MaxLength(255, { message: "Description must not exceed 255 characters." })
    description?: string;

    @IsNumber({}, { message: "Department ID must be a number." })
    @IsNotEmpty({ message: "Department ID is required." })
    departmentId: number;
}
