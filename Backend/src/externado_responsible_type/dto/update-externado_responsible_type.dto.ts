import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoResponsibleTypeDto } from './create-externado_responsible_type.dto';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateExternadoResponsibleTypeDto extends PartialType(CreateExternadoResponsibleTypeDto) {
    @IsNumber()
    @IsOptional()
    idexternado_responsible_type: number;

    @IsString()
    @MaxLength(45)
    @IsOptional()
    externado_responsible_type: string;
}
