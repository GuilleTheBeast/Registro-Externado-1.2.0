import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateExternadoSequenceDto {
    @IsNumber()
    @IsNotEmpty()
    idexternado_sequence: number;

    @IsNumber()
    @IsOptional()
    idexternado_user_sequence: number;

    @IsNumber()
    @IsOptional()
    idexternado_admin_sequence: number;

    @IsNumber()
    @IsOptional()
    idexternado_responsible_sequence: number;

    @IsNumber()
    @IsOptional()
    idexternado_student_sequence: number;

    @IsNumber()
    @IsOptional()
    idexternado_admin_system_sequence: number;

    @IsNumber()
    @IsOptional()
    idexternado_level: number;

    @IsNumber()
    @IsOptional()
    idexternado_department: number;

}
