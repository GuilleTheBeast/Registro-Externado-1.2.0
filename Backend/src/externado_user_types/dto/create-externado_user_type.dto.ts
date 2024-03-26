import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateExternadoUserTypeDto {
    @IsNumber()
    @IsNotEmpty()
    idexternado_user_type: number;

    @IsString()
    @MaxLength(15)
    @IsNotEmpty()
    externado_user_type: string;
}
