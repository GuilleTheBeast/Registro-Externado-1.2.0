import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExternadoPep } from './entities/externado_pep.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternadoUsersService } from 'src/externado_users/externado_users.service';

@Injectable()
export class ExternadoPepService {
  constructor(
    @InjectRepository(ExternadoPep)
    private readonly externadoPepRepository: Repository<ExternadoPep>,

    private readonly externadoUsersService:ExternadoUsersService
  )
  {}

  async getPep(uuid: string) {

    const user = await this.externadoUsersService.findOneByUUID(uuid);

    if(!user){
      throw new UnauthorizedException("No tiene permisos para ver este contenido");
    }

    return await this.externadoPepRepository.find({
      order: {
      idexternado_pep: 'ASC',
    },
  });
  }

}

