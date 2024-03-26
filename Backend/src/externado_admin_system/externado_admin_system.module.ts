import { Module } from '@nestjs/common';
import { ExternadoAdminSystemService } from './externado_admin_system.service';
import { ExternadoAdminSystemController } from './externado_admin_system.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoAdminSystem } from './entities/externado_admin_system.entity';
import { ExternadoUsersModule } from 'src/externado_users/externado_users.module';
import { ExternadoSequenceModule } from 'src/externado_sequence/externado_sequence.module';
import { ExternadoStudentModule } from 'src/externado_student/externado_student.module';

@Module({
  imports: [
    ExternadoUsersModule,
    ExternadoAdminSystemModule,
    ExternadoSequenceModule,
    ExternadoStudentModule,
    TypeOrmModule.forFeature([ExternadoAdminSystem])
  ],
  controllers: [ExternadoAdminSystemController],
  providers: [ExternadoAdminSystemService],
  exports: [ExternadoAdminSystemService]
})
export class ExternadoAdminSystemModule {}
