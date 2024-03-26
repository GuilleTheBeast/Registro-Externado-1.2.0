import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExternadoIncoming } from './entities/externado_incoming.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternadoUsersService } from 'src/externado_users/externado_users.service';

@Injectable()
export class ExternadoIncomingsService {
  constructor(
    @InjectRepository(ExternadoIncoming)
    private readonly externadoIncomingRepository: Repository<ExternadoIncoming>,

    private readonly externadoUsersService:ExternadoUsersService
  )
  {}
  
  async getIncomings(uuid: string) {

    const user = await this.externadoUsersService.findOneByUUID(uuid);

    if(!user){
      throw new UnauthorizedException("No tiene permisos para ver este contenido");
    }

    return await this.externadoIncomingRepository.find({
      order: {
      idexternado_incomings: 'ASC',
    },
  });
  }

}
