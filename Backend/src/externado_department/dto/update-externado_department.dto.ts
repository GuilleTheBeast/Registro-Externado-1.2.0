import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoDepartmentDto } from './create-externado_department.dto';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateExternadoDepartmentDto extends PartialType(CreateExternadoDepartmentDto) {
    @IsNumber()
    @IsOptional()
    idexternado_departments: number;

    @IsString()
    @MaxLength(30)
    @IsOptional()
    externado_department: string;
}
