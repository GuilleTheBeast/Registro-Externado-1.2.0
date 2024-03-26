import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoStudentDto } from './create-externado_student.dto';
import { IsBoolean, IsDate, IsDateString, IsEmail, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateExternadoStudentDto extends PartialType(CreateExternadoStudentDto) {
    @IsNumber()
    @IsOptional()
    idexternado_student: number;

    @IsNumber()
    @IsOptional()
    externado_user_id: number;

    @IsString()
    @MaxLength(60)
	@IsOptional()
    externado_student_firstname: string;

    @IsString()
    @MaxLength(60)
	@IsOptional()
    externado_student_lastname: string;

    @IsString()
    @MaxLength(120)
	@IsOptional()
    externado_student_birthplace: string;

    @IsDateString()
	@IsOptional()
    externado_student_birthdate: Date;

    @IsString()
    @MaxLength(30)
	@IsOptional()
    externado_student_nationality: string;

    @IsBoolean()
	@IsOptional()
    externado_student_gender: boolean;

    @IsString()
    @MaxLength(120)
	@IsOptional()
    externado_student_address: string;

    @IsString()
    @MaxLength(30)
	@IsOptional()
    externado_student_town: string;

    @IsNumber()
	@IsOptional()
    externado_student_department_id: number;

    @IsString()
    @MaxLength(20)
	@IsOptional()
    externado_student_phone: string;

    @IsString()
    @MaxLength(60)
    @IsEmail()
	@IsOptional()
    externado_student_email: string;

    @IsString()
    @MaxLength(120)
	@IsOptional()
    externado_student_last_school: string;

    @IsNumber()
	@IsOptional()
    externado_student_current_level_id: number;

    @IsString()
    @MaxLength(420)
	@IsOptional()
    externado_student_siblings: string;

    @IsBoolean()
	@IsOptional()
    externado_student_lives_with_parents: boolean;

    @IsString()
    @MaxLength(60)
	@IsOptional()
    externado_student_lives_with_who: string;

    @IsString()
    @MaxLength(60)
	@IsOptional()
    externado_student_lives_with_related: string;

    @IsString()
    @MaxLength(120)
	@IsOptional()
    externado_student_lives_with_address: string;

    @IsBoolean()
	@IsOptional()
    externado_student_catholic: boolean;

    @IsNumber()
    @IsOptional()
    externado_student_non_catholic_church_id: number;

    @IsString()
    @MaxLength(45)
    @IsOptional()
    externado_student_church_other: string;

    @IsString()
    @MaxLength(60)
	@IsOptional()
    externado_student_emergency_name: string;

    @IsString()
    @MaxLength(45)
	@IsOptional()
    externado_student_emergency_relationship: string;

    @IsString()
    @MaxLength(120)
	@IsOptional()
    externado_student_emergency_address: string;

    @IsString()
    @MaxLength(20)
	@IsOptional()
    externado_student_emergency_phone: string;

    @IsNumber()
	@IsOptional()
    externado_student_resp_type_id: number;

    @IsString()
    @MaxLength(45)
    @IsOptional()
    externado_student_rep_other: string;

    @IsString()
    @MaxLength(60)
	@IsOptional()
    externado_student_rep_name: string;

    @IsOptional()
    @IsNumber()
    externado_student_rep_id_type: number;

    @IsString()
    @MaxLength(20)
	@IsOptional()
    externado_student_rep_id: string;

    @IsString()
    @MaxLength(120)
	@IsOptional()
    externado_student_rep_address: string;

    @IsString()
    @MaxLength(20)
	@IsOptional()
    externado_student_rep_homephone: string;

    @IsString()
    @MaxLength(20)
	@IsOptional()
    externado_student_rep_work_phone: string;

    @IsString()
    @MaxLength(20)
	@IsOptional()
    externado_student_rep_mobile_phone: string;

    @IsString()
    @MaxLength(60)
    @IsEmail()
	@IsOptional()
    externado_student_rep_email: string;

    @IsBoolean()
	@IsOptional()
    externado_proccess_finished: boolean;

    @IsBoolean()
    @IsOptional()
    externado_form_valid: boolean;

    @IsBoolean()
	@IsOptional()
    externado_student_active: boolean;

    @IsBoolean()
    @IsOptional()
    externado_historical: boolean;
    
    @IsDate()
    @IsOptional()
    externado_creation_datetime: Date;
}
