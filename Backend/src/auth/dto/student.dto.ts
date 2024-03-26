import { IsNotEmpty, IsNumber } from "class-validator";

export class StudentDto {

    @IsNumber()
    @IsNotEmpty()
    idexternado_student: number;

}