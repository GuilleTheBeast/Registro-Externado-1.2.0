import { Module } from '@nestjs/common';
import { ExternadoStudentService } from './externado_student.service';
import { ExternadoStudentController } from './externado_student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoStudent } from './entities/externado_student.entity';
import { ExternadoUsersModule } from 'src/externado_users/externado_users.module';
import { ExternadoSequenceModule } from 'src/externado_sequence/externado_sequence.module';

@Module({
  imports: [
    ExternadoUsersModule,
    ExternadoSequenceModule,
    TypeOrmModule.forFeature([ExternadoStudent])
  ],
  controllers: [ExternadoStudentController],
  providers: [ExternadoStudentService],
  exports: [ExternadoStudentService],
})
export class ExternadoStudentModule {}
