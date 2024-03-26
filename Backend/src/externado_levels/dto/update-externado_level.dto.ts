import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoLevelDto } from './create-externado_level.dto';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateExternadoLevelDto extends PartialType(CreateExternadoLevelDto) {
    @IsNumber()
    @IsOptional()
    idexternado_level: number;

    @IsString()
    @MaxLength(35)
    @IsOptional()
    externado_level: string;
}
