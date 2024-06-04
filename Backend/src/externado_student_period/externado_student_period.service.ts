import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExternadoStudentPeriod } from "./entities/externado_student_period.entity";
import { Repository } from "typeorm";

@Injectable()
export class ExternadoStudentPeriodService {
    constructor (@InjectRepository(ExternadoStudentPeriod)
    private readonly externadoStudentRepository: Repository<ExternadoStudentPeriod>) {}

    getStudentPeriods(level?: string, period?: string) {
      let query = `
        SELECT 
        externado_student.externado_student_lastname,
          externado_student.externado_student_firstname, 
          externado_level.externado_level,
          externado_admin_system.externado_range_period,
          externado_student.externado_student_phone,
          externado_student.externado_student_email,
          externado_student.externado_student_birthplace, 
          externado_student.externado_student_birthdate,
          externado_student.externado_student_nationality,
          externado_department.externado_department,
          externado_student.externado_student_town,
          externado_student.externado_student_address,
          externado_student.externado_student_last_school,
          externado_student.externado_student_emergency_name,
          externado_student.externado_student_emergency_relationship,
          externado_student.externado_student_emergency_address,
          externado_student.externado_student_emergency_phone
        FROM 
          externado_student
        JOIN 
          externado_student_period ON externado_student_period.id_student = externado_student.idexternado_student
        JOIN 
          externado_admin_system ON externado_student_period.id_period = externado_admin_system.idexternado_admin_system
        JOIN 
          externado_level ON externado_student_period.id_level = externado_level.idexternado_level
        JOIN 
          externado_department ON externado_department.idexternado_departments = externado_student.externado_student_department_id
      `;
    
      // Conditions array
      const conditions = [];
      const params = [];
    
      if (level =='Favor seleccionar un valor'){ } else {
        if(level && level !='Favor seleccionar un valor') {
          conditions.push('externado_level.externado_level LIKE ?');
          params.push(`%${level}%`);
        } 
      }
    
      if (period == 'Todos') {} else {
        if(period && period != 'Todos'){
          conditions.push('externado_admin_system.externado_range_period LIKE ?');
          params.push(`%${period}%`);
        }
      }
      // Append conditions to the base query if there are any
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

       //Ordenar por Apellido
       query += ' ORDER BY externado_student.externado_student_lastname';

      return this.externadoStudentRepository.query(query, params);
    }
      
}