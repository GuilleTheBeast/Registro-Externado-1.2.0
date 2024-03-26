import { IsNotEmpty, IsNumber } from "class-validator";

export class EncriptDto {

    @IsNumber()
    @IsNotEmpty()
    minValue;
    
    @IsNumber()
    @IsNotEmpty()
    maxValue;

}