import { IsBoolean, IsDate, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateExternadoStudentDto {
    @IsNumber()
    @IsNotEmpty()
    idexternado_student: number;

    @IsNumber()
    @IsNotEmpty()
    externado_user_id: number;

    @IsString()
    @MaxLength(60)
    externado_student_firstname: string;

    @IsString()
    @MaxLength(60)
    externado_student_lastname: string;

    @IsString()
    @MaxLength(120)
    externado_student_birthplace: string;

    @IsDateString()
    externado_student_birthdate: Date;

    @IsString()
    @MaxLength(30)
    externado_student_nationality: string;

    @IsBoolean()
    externado_student_gender: boolean;

    @IsString()
    @MaxLength(120)
    externado_student_address: string;

    @IsString()
    @MaxLength(30)
    externado_student_town: string;

    @IsNumber()
    externado_student_department_id: number;

    @IsString()
    @MaxLength(20)
    externado_student_phone: string;

    @IsString()
    @MaxLength(60)
    @IsEmail()
    externado_student_email: string;

    @IsString()
    @MaxLength(120)
    externado_student_last_school: string;

    @IsNumber()
    externado_student_current_level_id: number;

    @IsBoolean()
    externado_student_has_siblings: boolean;

    @IsString()
    @MaxLength(420)
    externado_student_siblings: string;

    @IsBoolean()
    externado_student_lives_with_parents: boolean;

    @IsString()
    @MaxLength(60)
    externado_student_lives_with_who: string;

    @IsString()
    @MaxLength(60)
    externado_student_lives_with_related: string;

    @IsString()
    @MaxLength(120)
    externado_student_lives_with_address: string;

    @IsBoolean()
    externado_student_catholic: boolean;

    @IsNumber()
    externado_student_non_catholic_church_id: number;

    @IsString()
    @MaxLength(45)
    externado_student_church_other: string;

    @IsString()
    @MaxLength(60)
    externado_student_emergency_name: string;

    @IsString()
    @MaxLength(45)
    externado_student_emergency_relationship: string;

    @IsString()
    @MaxLength(120)
    externado_student_emergency_address: string;

    @IsString()
    @MaxLength(20)
    externado_student_emergency_phone: string;

    @IsNumber()
    externado_student_resp_type_id: number;

    @IsString()
    @MaxLength(45)
    externado_student_rep_other: string;

    @IsString()
    @MaxLength(60)
    externado_student_rep_name: string;

    @IsNumber()
    externado_student_rep_id_type: number;

    @IsString()
    @MaxLength(20)
    externado_student_rep_id: string;

    @IsString()
    @MaxLength(120)
    externado_student_rep_address: string;

    @IsString()
    @MaxLength(20)
    externado_student_rep_homephone: string;

    @IsString()
    @MaxLength(20)
    externado_student_rep_work_phone: string;

    @IsString()
    @MaxLength(20)
    externado_student_rep_mobile_phone: string;

    @IsString()
    @MaxLength(60)
    @IsEmail()
    externado_student_rep_email: string;

    @IsBoolean()
    @IsNotEmpty()
    externado_proccess_finished: boolean;

    @IsBoolean()
    @IsNotEmpty()
    externado_form_valid: boolean;

    @IsBoolean()
    @IsNotEmpty()
    externado_student_active: boolean;

    @IsBoolean()
    @IsNotEmpty()
    externado_historical: boolean;
    
    @IsDate()
    @IsNotEmpty()
    externado_creation_datetime: Date;
}
