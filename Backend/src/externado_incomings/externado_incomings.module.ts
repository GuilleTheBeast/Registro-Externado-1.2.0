import { Module } from '@nestjs/common';
import { ExternadoIncomingsService } from './externado_incomings.service';
import { ExternadoIncomingsController } from './externado_incomings.controller';
import { ExternadoIncoming } from './entities/externado_incoming.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoUsersModule } from 'src/externado_users/externado_users.module';

@Module({
  imports:[
    ExternadoUsersModule,
    TypeOrmModule.forFeature([ExternadoIncoming])
  ],
  controllers: [ExternadoIncomingsController],
  providers: [ExternadoIncomingsService],
  exports: [ExternadoIncomingsService]
})
export class ExternadoIncomingsModule {}
