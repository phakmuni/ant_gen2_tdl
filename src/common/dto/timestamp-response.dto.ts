import { Expose, Transform } from "class-transformer";
import * as dayjs from "dayjs";


export class TimestampResponseDto {
    @Expose()
    // @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
    createdAt: string;

    @Expose()
    // @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
    updatedAt: string;
}