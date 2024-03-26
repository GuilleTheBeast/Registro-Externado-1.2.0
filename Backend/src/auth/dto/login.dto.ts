import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginDto {
    
    @IsString()
    @MaxLength(60)
    @IsEmail()
    @IsNotEmpty()
    externado_email;

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    externado_pass;

}