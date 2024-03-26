import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoAdminSystemDto } from './create-externado_admin_system.dto';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateExternadoAdminSystemDto extends PartialType(CreateExternadoAdminSystemDto) {
    @IsNumber()
    @IsOptional()
    idexternado_admin_system: number;

    @IsString()
    @MaxLength(60)
    @IsOptional()
    externado_generic_pass: string;

    @IsString()
    @MaxLength(60)
    @IsOptional()
    externado_range_period: string;

    @IsOptional()
    externado_active_period: boolean;

    @IsOptional()
    externado_system_closed: boolean;
}
