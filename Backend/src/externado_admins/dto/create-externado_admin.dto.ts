import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateExternadoAdminDto {

    @IsNumber()
    @IsNotEmpty()
    externado_user_id: number;

    @IsString()
    @MaxLength(60)
    @IsNotEmpty()
    externado_admin_firstname: string;

    @IsString()
    @MaxLength(60)
    @IsNotEmpty()
    externado_admin_lastname: string;

    @IsOptional()
    externado_admin_active: boolean;

}
