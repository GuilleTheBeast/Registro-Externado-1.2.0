import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoUserTypeDto } from './create-externado_user_type.dto';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateExternadoUserTypeDto extends PartialType(CreateExternadoUserTypeDto) {
    @IsNumber()
    @IsOptional()
    idexternado_user_type: number;

    @IsString()
    @MaxLength(15)
    @IsOptional()
    externado_user_type: string;
}
