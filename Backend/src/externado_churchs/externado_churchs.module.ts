import { Module } from '@nestjs/common';
import { ExternadoChurchsService } from './externado_churchs.service';
import { ExternadoChurchsController } from './externado_churchs.controller';
import { ExternadoUsersModule } from 'src/externado_users/externado_users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoChurch } from './entities/externado_church.entity';

@Module({
  imports: [
    ExternadoUsersModule,
    TypeOrmModule.forFeature([ExternadoChurch])
  ],
  controllers: [ExternadoChurchsController],
  providers: [ExternadoChurchsService],
  exports: [ExternadoChurchsService]
})
export class ExternadoChurchsModule {}
