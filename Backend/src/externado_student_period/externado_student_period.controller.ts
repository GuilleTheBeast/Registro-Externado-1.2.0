import { Controller, Get } from "@nestjs/common";
import { ExternadoStudentPeriodService } from "./externado_student_period.service";

@Controller('externado-student')
export class ExternadoStudentPeriodController {
    constructor(private readonly externado_student_period_Service: ExternadoStudentPeriodService) {}
    @Get("getStudentsPeriod")
    getStudentsPeriod(){
      return this.externado_student_period_Service.getStudentPeriods();
  }
}