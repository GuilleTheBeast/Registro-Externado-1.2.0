import { PartialType } from '@nestjs/mapped-types';
import { CreateExternadoResponsibleDto } from './create-externado_responsible.dto';
import { IsBoolean, IsDateString, IsEmail, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateExternadoResponsibleDto extends PartialType(CreateExternadoResponsibleDto) {
    @IsNumber()
    @IsOptional()
    idexternado_responsible: number;

    @IsNumber()
    @IsOptional()
    externado_user_id: number;

    @IsString()
    @MaxLength(60)
	@IsOptional()
    externado_firstname: string;

    @IsString()
    @MaxLength(60)
	@IsOptional()
    externado_lastname: string;

    @IsDateString()
	@IsOptional()
    externado_birthdate: Date;

    @IsBoolean()
	@IsOptional()
    externado_id_type: boolean;

    @IsString()
    @MaxLength(20)
	@IsOptional()
    externado_id: string;

    @IsString()
    @MaxLength(20)
	@IsOptional()
    externado_nit: string;

    @IsString()
    @MaxLength(30)
	@IsOptional()
    externado_nationality: string;

    @IsString()
    @MaxLength(120)
	@IsOptional()
    externado_address: string;

    @IsString()
    @MaxLength(30)
	@IsOptional()
    externado_town: string;

    @IsNumber()
    @IsOptional()
    externado_department_id: number;

    @IsString()
    @MaxLength(20)
	@IsOptional()
    externado_work_phone: string;

    @IsString()
    @MaxLength(20)
	@IsOptional()
    externado_mobile_phone: string;

    @IsString()
    @MaxLength(60)
    @IsEmail()
	@IsOptional()
    externado_email: string;

    @IsString()
    @MaxLength(120)
	@IsOptional()
    externado_occupation: string;

    @IsString()
    @MaxLength(120)
	@IsOptional()
    externado_workplace: string;

    @IsString()
    @MaxLength(120)
	@IsOptional()
    externado_jobposition: string;

    @IsBoolean()
    @IsOptional()
    externado_pep: boolean;

    @IsNumber()
    @IsOptional()
    externado_pep_occupation_id: number;

    @IsString()
    @MaxLength(120)
    @IsOptional()
    externado_pep_occupation_other: string;

    @IsBoolean()
    @IsOptional()
    externado_pep_3years: boolean;

    @IsNumber()
    @IsOptional()
    externado_pep_3years_occupation_id: number;

    @IsString()
    @MaxLength(120)
    @IsOptional()
    externado_pep_3years_occupation_other: string;

    @IsNumber()
	@IsOptional()
    externado_incomings_id: number;

    @IsString()
    @MaxLength(45)
    @IsOptional()
    externado_incomings_other: string;

    @IsBoolean()
	@IsOptional()
    externado_former_externado_student: boolean;

    @IsString()
    @MaxLength(120)
	@IsOptional()
    externado_university_studies: string;

    @IsString()
    @MaxLength(45)
	@IsOptional()
    externado_responsible_relationship: string;

    @IsBoolean()
	@IsOptional()
    externado_direct_responsible: boolean;

    @IsNumber()
	@IsOptional()
    externado_responsible_type_id: number;

    @IsBoolean()
    @IsOptional()
    externado_form_valid: boolean;

    @IsBoolean()
	@IsOptional()
    externado_active: boolean;

    @IsBoolean()
	@IsOptional()
    externado_historical: boolean;
}
