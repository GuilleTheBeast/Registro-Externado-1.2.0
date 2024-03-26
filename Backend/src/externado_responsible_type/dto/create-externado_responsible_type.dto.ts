import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateExternadoResponsibleTypeDto {
    @IsNumber()
    @IsNotEmpty()
    idexternado_responsible_type: number;

    @IsString()
    @MaxLength(45)
    @IsNotEmpty()
    externado_responsible_type: string;
}
