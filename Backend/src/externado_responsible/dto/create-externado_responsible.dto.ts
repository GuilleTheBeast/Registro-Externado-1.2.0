import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateExternadoResponsibleDto {
    @IsNumber()
    @IsNotEmpty()
    idexternado_responsible: number;

    @IsNumber()
    @IsNotEmpty()
    externado_user_id: number;

    @IsString()
    @MaxLength(60)
    externado_firstname: string;

    @IsString()
    @MaxLength(60)
    externado_lastname: string;

    @IsDateString()
    externado_birthdate: Date;

    @IsBoolean()
    externado_id_type: boolean;

    @IsString()
    @MaxLength(20)
    externado_id: string;

    @IsString()
    @MaxLength(20)
    externado_nit: string;

    @IsString()
    @MaxLength(30)
    externado_nationality: string;

    @IsString()
    @MaxLength(120)
    externado_address: string;

    @IsString()
    @MaxLength(30)
    externado_town: string;

    @IsNumber()
    externado_department_id: number;

    @IsString()
    @MaxLength(20)
    externado_work_phone: string;

    @IsString()
    @MaxLength(20)
    externado_mobile_phone: string;

    @IsString()
    @MaxLength(60)
    @IsEmail()
    externado_email: string;

    @IsString()
    @MaxLength(120)
    externado_occupation: string;

    @IsString()
    @MaxLength(120)
    externado_workplace: string;

    @IsString()
    @MaxLength(120)
    externado_jobposition: string;

    @IsBoolean()
    externado_pep: boolean;

    @IsNumber()
    externado_pep_occupation_id: number;

    @IsString()
    @MaxLength(120)
    externado_pep_occupation_other: string;

    @IsBoolean()
    externado_pep_3years: boolean;

    @IsNumber()
    externado_pep_3years_occupation_id: number;

    @IsString()
    @MaxLength(120)
    externado_pep_3years_occupation_other: string;

    @IsNumber()
    externado_incomings_id: number;

    @IsString()
    @MaxLength(45)
    externado_incomings_other: string;

    @IsBoolean()
    externado_former_externado_student: boolean;

    @IsString()
    @MaxLength(120)
    externado_university_studies: string;

    @IsString()
    @MaxLength(45)
    externado_responsible_relationship: string;

    @IsBoolean()
    externado_direct_responsible: boolean;

    @IsNumber()
    externado_responsible_type_id: number;

    @IsBoolean()
    externado_form_valid: boolean;

    @IsBoolean()
    externado_active: boolean;

    @IsBoolean()
    externado_historical: boolean;
    
}
