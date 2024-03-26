import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateExternadoStudentResponsibleTypeDto {
    @IsNumber()
    @IsNotEmpty()
    idexternado_student_responsible_type: number;

    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    externado_student_responsible_type: string;
}
