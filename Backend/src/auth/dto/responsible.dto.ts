import { IsNotEmpty, IsNumber } from "class-validator";

export class ResponsibleDto {

    @IsNumber()
    @IsNotEmpty()
    idexternado_responsible: number;

}