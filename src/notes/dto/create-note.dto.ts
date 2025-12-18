import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;

  @IsOptional()
  @IsString()
  content: string;

}
