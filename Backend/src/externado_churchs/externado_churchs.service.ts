import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternadoChurch } from './entities/externado_church.entity';
import { ExternadoUsersService } from 'src/externado_users/externado_users.service';

@Injectable()
export class ExternadoChurchsService {
  constructor(
    @InjectRepository(ExternadoChurch)
    private readonly externadoChurchRepository: Repository<ExternadoChurch>,

    private readonly externadoUsersService:ExternadoUsersService
  )
  {}

  async getChurch(uuid: string) {

    const user = await this.externadoUsersService.findOneByUUID(uuid);

    if(!user){
      throw new UnauthorizedException("No tiene permisos para ver este contenido");
    }
    
    return await this.externadoChurchRepository.find({
      order: {
      idexternado_church: 'ASC',
    },
  });
  }

}
