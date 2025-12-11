import { Expose } from "class-transformer";


export class ResponseGenerationDto {

    @Expose()
    id: number;
    @Expose()
    name: string;

}