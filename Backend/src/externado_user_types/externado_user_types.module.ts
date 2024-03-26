import { Module } from '@nestjs/common';
import { ExternadoUserTypesService } from './externado_user_types.service';
import { ExternadoUserTypesController } from './externado_user_types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoUserType } from './entities/externado_user_type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExternadoUserType])
  ],
  controllers: [ExternadoUserTypesController],
  providers: [ExternadoUserTypesService],
  exports: [ExternadoUserTypesService]
})
export class ExternadoUserTypesModule {}
