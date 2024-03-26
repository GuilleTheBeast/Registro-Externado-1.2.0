import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateExternadoChurchDto {
    @IsNumber()
    @IsNotEmpty()
    idexternado_church: number;

    @IsString()
    @MaxLength(45)
    @IsNotEmpty()
    externado_church_value: string;
}
