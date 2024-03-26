import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateExternadoIncomingDto {

    @IsNumber()
    @IsNotEmpty()
    idexternado_incomings: number;

    @IsString()
    @MaxLength(45)
    @IsNotEmpty()
    externado_incomings_value: string;
    
}
