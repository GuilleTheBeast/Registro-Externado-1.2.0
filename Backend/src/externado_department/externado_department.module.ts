import { Module } from '@nestjs/common';
import { ExternadoDepartmentService } from './externado_department.service';
import { ExternadoDepartmentController } from './externado_department.controller';
import { ExternadoDepartment } from './entities/externado_department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoUsersModule } from 'src/externado_users/externado_users.module';

@Module({
  imports: [
    ExternadoUsersModule,
    TypeOrmModule.forFeature([ExternadoDepartment])
  ],
  controllers: [ExternadoDepartmentController],
  providers: [ExternadoDepartmentService],
  exports: [ExternadoDepartmentService],
})
export class ExternadoDepartmentModule {}
