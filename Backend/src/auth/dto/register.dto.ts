import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class RegisterDto {

    @IsNumber()
    @IsOptional()
    idexternado_user: number;

    @IsString()
    @MaxLength(60)
    @IsEmail()
    @IsNotEmpty()
    externado_email: string;

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    externado_pass: string;

    @IsString()
    @MaxLength(60)
    @IsNotEmpty()
    externado_generic_pass: string;

    @IsOptional()
    externado_active_email: boolean;

    @IsString()
    @MaxLength(45)
    @IsOptional()
    externado_uuid: string;
}