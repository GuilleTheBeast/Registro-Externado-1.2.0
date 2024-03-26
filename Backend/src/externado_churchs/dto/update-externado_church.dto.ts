import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoChurchDto } from './create-externado_church.dto';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateExternadoChurchDto extends PartialType(CreateExternadoChurchDto) {
    @IsNumber()
    @IsOptional()
    idexternado_church: number;

    @IsString()
    @MaxLength(45)
    @IsOptional()
    externado_church_value: string;
}
