import { Module } from '@nestjs/common';
import { ExternadoUsersService } from './externado_users.service';
import { ExternadoUsersController } from './externado_users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternadoUser } from './entities/externado_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExternadoUser])],
  controllers: [ExternadoUsersController],
  providers: [ExternadoUsersService],
  exports: [ExternadoUsersService]
})
export class ExternadoUsersModule {}
