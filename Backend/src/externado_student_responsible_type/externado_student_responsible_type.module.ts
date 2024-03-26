import { Module } from '@nestjs/common';
import { ExternadoStudentResponsibleTypeService } from './externado_student_responsible_type.service';
import { ExternadoStudentResponsibleTypeController } from './externado_student_responsible_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoStudentResponsibleType } from './entities/externado_student_responsible_type.entity';
import { ExternadoUsersModule } from 'src/externado_users/externado_users.module';

@Module({
  imports: [
    ExternadoUsersModule,
    TypeOrmModule.forFeature([ExternadoStudentResponsibleType])
  ],
  controllers: [ExternadoStudentResponsibleTypeController],
  providers: [ExternadoStudentResponsibleTypeService],
  exports: [ExternadoStudentResponsibleTypeService],
})
export class ExternadoStudentResponsibleTypeModule {}
