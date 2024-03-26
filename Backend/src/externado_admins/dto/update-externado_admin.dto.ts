import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoAdminDto } from './create-externado_admin.dto';

export class UpdateExternadoAdminDto extends PartialType(CreateExternadoAdminDto) {

    @IsNumber()
    @IsOptional()
    externado_user_id: number;

    @IsString()
    @MaxLength(60)
    @IsOptional()
    externado_admin_firstname: string;

    @IsString()
    @MaxLength(60)
    @IsOptional()
    externado_admin_lastname: string;

    @IsString()
    @MaxLength(45)
    @IsOptional()
    externado_carnet: string;

    @IsOptional()
    externado_admin_active: boolean;

    @IsOptional()
    externado_user_type_id: number;
}
