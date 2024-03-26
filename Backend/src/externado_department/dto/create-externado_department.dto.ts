import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateExternadoDepartmentDto {
    @IsNumber()
    @IsNotEmpty()
    idexternado_departments: number;

    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    externado_department: string;
}
