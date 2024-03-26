import { Module } from '@nestjs/common';
import { ExternadoPepService } from './externado_pep.service';
import { ExternadoPepController } from './externado_pep.controller';
import { ExternadoPep } from './entities/externado_pep.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoUsersModule } from 'src/externado_users/externado_users.module';

@Module({
  imports:[
    ExternadoUsersModule,
    TypeOrmModule.forFeature([ExternadoPep])
  ],
  controllers: [ExternadoPepController],
  providers: [ExternadoPepService],
  exports: [ExternadoPepService]
})
export class ExternadoPepModule {}
