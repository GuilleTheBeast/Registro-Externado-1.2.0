import { Module } from '@nestjs/common';
import { ExternadoLevelsService } from './externado_levels.service';
import { ExternadoLevelsController } from './externado_levels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoLevel } from './entities/externado_level.entity';
import { ExternadoUsersModule } from 'src/externado_users/externado_users.module';

@Module({
  imports: [
    ExternadoUsersModule,
    TypeOrmModule.forFeature([ExternadoLevel])
  ],
  controllers: [ExternadoLevelsController],
  providers: [ExternadoLevelsService],
  exports: [ExternadoLevelsService],
})
export class ExternadoLevelsModule {}
