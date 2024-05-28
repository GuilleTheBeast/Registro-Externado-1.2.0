import { Module } from '@nestjs/common';
import { ExternadoStudentPeriod } from "./entities/externado_student_period.entity";
import { ExternadoStudentPeriodController } from "./externado_student_period.controller";
import { ExternadoStudentPeriodService } from "./externado_student_period.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { SheetjsController } from 'src/sheetjs/sheetjs.controller';

@Module({
    imports: [
      TypeOrmModule.forFeature([ExternadoStudentPeriod])
    ],
    controllers: [ExternadoStudentPeriodController, SheetjsController],
    providers: [ExternadoStudentPeriodService],
    exports: [ExternadoStudentPeriodService],
  })
  export class ExternadoStudentPeriodModule {}