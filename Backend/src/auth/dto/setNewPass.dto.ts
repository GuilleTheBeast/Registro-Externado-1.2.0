import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SetNewPassDto {

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    externado_pass;

}