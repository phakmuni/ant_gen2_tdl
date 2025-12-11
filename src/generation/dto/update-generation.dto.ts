import { IsNotEmpty, IsString, MaxLength, IsNumber, IsOptional } from "class-validator";

export class UpdateGenerationDto {
    
    @IsOptional()
    @IsString({ message: "Generation name must be a string." })
    @IsNotEmpty({ message: "Generation name is required." })
    @MaxLength(100, { message: "Generation name must not exceed 100 characters." })
    name: string;

    @IsOptional()
    @IsNumber({}, { message: "Start year must be a number." })
    @IsNotEmpty({ message: "Start year is required." })
    startYear: number;

    @IsOptional()
    @IsNumber({}, { message: "End year must be a number." })
    @IsNotEmpty({ message: "End year is required." })
    endYear: number;

    @IsOptional()
    @IsString({ message: "Description must be a string." })
    @MaxLength(255, { message: "Description must not exceed 255 characters." })
    description?: string;

}
