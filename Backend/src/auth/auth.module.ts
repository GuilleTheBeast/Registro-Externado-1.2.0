import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ExternadoUsersModule } from 'src/externado_users/externado_users.module';
import { ExternadoAdminSystemModule } from 'src/externado_admin_system/externado_admin_system.module';
import { ExternadoSequenceModule } from 'src/externado_sequence/externado_sequence.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constants';
import { ExternadoStudentResponsibleTypeModule } from 'src/externado_student_responsible_type/externado_student_responsible_type.module';
import { ExternadoStudentModule } from 'src/externado_student/externado_student.module';
import { ExternadoResponsibleTypeModule } from 'src/externado_responsible_type/externado_responsible_type.module';
import { ExternadoResponsibleModule } from 'src/externado_responsible/externado_responsible.module';
import { ExternadoLevelsModule } from 'src/externado_levels/externado_levels.module';
import { ExternadoDepartmentModule } from 'src/externado_department/externado_department.module';
import { ExternadoAdminsModule } from 'src/externado_admins/externado_admins.module';
import { EmailSenderModule } from 'src/email_sender/email_sender.module';

@Module({
  imports: [
    ExternadoUsersModule,
    ExternadoAdminSystemModule,
    ExternadoSequenceModule,
    ExternadoStudentResponsibleTypeModule,
    ExternadoStudentModule,
    ExternadoResponsibleTypeModule,
    ExternadoResponsibleModule,
    ExternadoLevelsModule,
    ExternadoDepartmentModule,
    ExternadoAdminsModule,
    EmailSenderModule,

    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h'},
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
