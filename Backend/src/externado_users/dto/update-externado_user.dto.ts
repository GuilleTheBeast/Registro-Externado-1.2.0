import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoUserDto } from './create-externado_user.dto';
import { IsEmail, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateExternadoUserDto extends PartialType(CreateExternadoUserDto) {
    
    @IsNumber()
    @IsOptional()
    idexternado_user: number;

    @IsString()
    @MaxLength(60)
    @IsEmail()
    @IsOptional()
    externado_email: string;

    @IsString()
    @MaxLength(100)
    @IsOptional()
    externado_pass: string;
    
    @IsNumber()
    @IsOptional()
    externado_user_type_id: number;

    @IsOptional()
    externado_active_user: boolean;

    @IsOptional()
    externado_reset_password: boolean;

    @IsString()
    @MaxLength(60)
    @IsOptional()
    externado_generic_pass: string;

    @IsOptional()
    externado_active_email: boolean;

    @IsOptional()
    externado_massive_created: boolean;

    @IsString()
    @MaxLength(45)
    @IsUUID()
    @IsOptional()
    externado_uuid: string;

}
