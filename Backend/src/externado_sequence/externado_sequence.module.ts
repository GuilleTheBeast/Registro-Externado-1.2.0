import { Module } from '@nestjs/common';
import { ExternadoSequenceService } from './externado_sequence.service';
import { ExternadoSequenceController } from './externado_sequence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoSequence } from './entities/externado_sequence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExternadoSequence])],
  controllers: [ExternadoSequenceController],
  providers: [ExternadoSequenceService],
  exports: [ExternadoSequenceService]
})
export class ExternadoSequenceModule {}
