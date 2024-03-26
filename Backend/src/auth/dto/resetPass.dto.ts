import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ResetPassDto {
    
    @IsString()
    @MaxLength(60)
    @IsEmail()
    @IsNotEmpty()
    externado_email;

}