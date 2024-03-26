import { Module } from '@nestjs/common';
import { ExternadoResponsibleService } from './externado_responsible.service';
import { ExternadoResponsibleController } from './externado_responsible.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoResponsible } from './entities/externado_responsible.entity';
import { ExternadoUsersModule } from 'src/externado_users/externado_users.module';
import { ExternadoSequenceModule } from 'src/externado_sequence/externado_sequence.module';

@Module({
  imports: [
    ExternadoUsersModule,
    ExternadoSequenceModule,
    TypeOrmModule.forFeature([ExternadoResponsible])
  ],
  controllers: [ExternadoResponsibleController],
  providers: [ExternadoResponsibleService],
  exports: [ExternadoResponsibleService],
})
export class ExternadoResponsibleModule {}
