import { Module } from '@nestjs/common';
import { ExternadoUsersModule } from './externado_users/externado_users.module';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoAdminsModule } from './externado_admins/externado_admins.module';
import { ExternadoLevelsModule } from './externado_levels/externado_levels.module';
import { ExternadoResponsibleTypeModule } from './externado_responsible_type/externado_responsible_type.module';
import { ExternadoAdminSystemModule } from './externado_admin_system/externado_admin_system.module';
import { ExternadoDepartmentModule } from './externado_department/externado_department.module';
import { ExternadoSequenceModule } from './externado_sequence/externado_sequence.module';
import { ExternadoStudentResponsibleTypeModule } from './externado_student_responsible_type/externado_student_responsible_type.module';
import { ExternadoResponsibleModule } from './externado_responsible/externado_responsible.module';
import { ExternadoStudentModule } from './externado_student/externado_student.module';
import { AuthModule } from './auth/auth.module';
import { ExternadoPepModule } from './externado_pep/externado_pep.module';
import { ExternadoIncomingsModule } from './externado_incomings/externado_incomings.module';
import { ExternadoChurchsModule } from './externado_churchs/externado_churchs.module';
import { ExternadoUserTypesModule } from './externado_user_types/externado_user_types.module';
import { EmailSenderModule } from './email_sender/email_sender.module';
import { ExternadoStudentPeriodModule } from './externado_student_period/externado_student_period.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ExternadoUsersModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      autoLoadEntities: true,
      synchronize: false,//TODO Colocarlo en false para cuando se pase al servidor
    }),
    ExternadoAdminsModule,
    ExternadoLevelsModule,
    ExternadoResponsibleTypeModule,
    ExternadoAdminSystemModule,
    ExternadoDepartmentModule,
    ExternadoSequenceModule,
    ExternadoStudentResponsibleTypeModule,
    ExternadoResponsibleModule,
    ExternadoStudentModule,
    AuthModule,
    ExternadoPepModule,
    ExternadoIncomingsModule,
    ExternadoChurchsModule,
    ExternadoUserTypesModule,
    EmailSenderModule,
    ExternadoStudentPeriodModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
