import { IsBoolean} from 'class-validator';

export class UpdateNoteDto {
    @IsBoolean({message:"Status must be a boolean ( true/false "})

  isCompleted:boolean;
}