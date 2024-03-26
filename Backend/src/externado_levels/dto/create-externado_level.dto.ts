import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateExternadoLevelDto {
    @IsNumber()
    @IsNotEmpty()
    idexternado_level: number;

    @IsString()
    @MaxLength(35)
    @IsNotEmpty()
    externado_level: string;
}
