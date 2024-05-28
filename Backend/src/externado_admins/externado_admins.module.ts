import { Module } from '@nestjs/common';
import { ExternadoAdminsService } from './externado_admins.service';
import { ExternadoAdminsController } from './externado_admins.controller';
import { ExternadoAdmin } from './entities/externado_admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoUsersModule } from 'src/externado_users/externado_users.module';
import { ExternadoStudentModule } from 'src/externado_student/externado_student.module';
import { ExternadoResponsibleModule } from 'src/externado_responsible/externado_responsible.module';
import { ExternadoLevelsModule } from 'src/externado_levels/externado_levels.module';

@Module({
  imports: [
    ExternadoUsersModule,
    ExternadoStudentModule,
    ExternadoResponsibleModule,
    ExternadoLevelsModule,
    TypeOrmModule.forFeature([ExternadoAdmin])
  ],
  controllers: [ExternadoAdminsController],
  providers: [ExternadoAdminsService],
  exports: [ExternadoAdminsService]
})
export class ExternadoAdminsModule {}
