import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateExternadoPepDto {
    
    @IsNumber()
    @IsNotEmpty()
    idexternado_pep: number;

    @IsString()
    @MaxLength(45)
    @IsNotEmpty()
    externado_pep_value: string;

}
