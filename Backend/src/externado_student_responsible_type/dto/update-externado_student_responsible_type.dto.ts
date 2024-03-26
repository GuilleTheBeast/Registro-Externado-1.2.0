import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoStudentResponsibleTypeDto } from './create-externado_student_responsible_type.dto';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateExternadoStudentResponsibleTypeDto extends PartialType(CreateExternadoStudentResponsibleTypeDto) {
    @IsNumber()
    @IsOptional()
    idexternado_student_responsible_type: number;

    @IsString()
    @MaxLength(30)
    @IsOptional()
    externado_student_responsible_type: string;
}
