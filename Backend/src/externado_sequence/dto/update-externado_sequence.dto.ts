import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoSequenceDto } from './create-externado_sequence.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateExternadoSequenceDto extends PartialType(CreateExternadoSequenceDto) {
    @IsNumber()
    @IsOptional()
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
