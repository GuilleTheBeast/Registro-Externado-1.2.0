import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExternadoStudentPeriod } from "./entities/externado_student_period.entity";
import { Repository } from "typeorm";

@Injectable()
export class ExternadoStudentPeriodService {
    constructor (@InjectRepository(ExternadoStudentPeriod)
    private readonly externadoStudentRepository: Repository<ExternadoStudentPeriod>) {}

     getStudentPeriods (){
        return this.externadoStudentRepository.query(`
        select externado_student.externado_student_firstname, 
          externado_student.externado_student_lastname, 
          externado_student.externado_student_address,
          externado_student.externado_student_phone,
          externado_student.externado_student_email,
          externado_level.externado_level,
          externado_admin_system.externado_range_period
        from externado_student, externado_admin_system, externado_student_period, externado_level
        where  externado_student_period.id_period = externado_admin_system.idexternado_admin_system
        AND externado_student_period.id_student = externado_student.idexternado_student
        AND externado_student.externado_student_current_level_id = externado_level.idexternado_level;
        `);
      }
}