import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoPepDto } from './create-externado_pep.dto';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateExternadoPepDto extends PartialType(CreateExternadoPepDto) {
    @IsNumber()
    @IsOptional()
    idexternado_pep: number;

    @IsString()
    @MaxLength(45)
    @IsOptional()
    externado_pep_value: string;
}
