import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoIncomingDto } from './create-externado_incoming.dto';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateExternadoIncomingDto extends PartialType(CreateExternadoIncomingDto) {

    @IsNumber()
    @IsOptional()
    idexternado_incomings: number;

    @IsString()
    @MaxLength(45)
    @IsOptional()
    externado_incomings_value: string;
    
}
