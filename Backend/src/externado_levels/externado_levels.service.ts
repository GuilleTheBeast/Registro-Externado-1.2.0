import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternadoLevel } from './entities/externado_level.entity';
import { Repository } from 'typeorm';
import { ExternadoUsersService } from 'src/externado_users/externado_users.service';


@Injectable()
export class ExternadoLevelsService {

  constructor(
    @InjectRepository(ExternadoLevel)
    private readonly externadoAdminRepository: Repository<ExternadoLevel>,

    private readonly externadoUsersService:ExternadoUsersService
  )
  {}

  async getLevels(uuid: string) {

    const user = await this.externadoUsersService.findOneByUUID(uuid);

    if(!user){
      throw new UnauthorizedException("No tiene permisos para ver este contenido");
    }

    return await this.externadoAdminRepository.find({
      order: {
      idexternado_level: 'ASC',
    },
  });
  }
// Prueba
  async getLevels2 (){
    return await this.externadoAdminRepository.find();
  }

}
