import { Module } from '@nestjs/common';
import { ExternadoResponsibleTypeService } from './externado_responsible_type.service';
import { ExternadoResponsibleTypeController } from './externado_responsible_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoResponsibleType } from './entities/externado_responsible_type.entity';
import { ExternadoUsersModule } from 'src/externado_users/externado_users.module';

@Module({
  imports: [
    ExternadoUsersModule,
    TypeOrmModule.forFeature([ExternadoResponsibleType])
  ],
  controllers: [ExternadoResponsibleTypeController],
  providers: [ExternadoResponsibleTypeService],
  exports: [ExternadoResponsibleTypeService],
})
export class ExternadoResponsibleTypeModule {}
