import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateExternadoAdminSystemDto {

    @IsNumber()
    @IsNotEmpty()
    idexternado_admin_system: number;

    @IsString()
    @MaxLength(60)
    @IsNotEmpty()
    externado_generic_pass: string;

    @IsString()
    @MaxLength(60)
    @IsNotEmpty()
    externado_range_period: string;

    @IsOptional()
    externado_active_period: boolean;

    @IsOptional()
    externado_system_closed: boolean;

}
