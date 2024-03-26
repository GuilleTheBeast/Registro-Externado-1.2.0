import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternadoResponsibleType } from './entities/externado_responsible_type.entity';
import { Repository } from 'typeorm';
import { ExternadoUsersService } from 'src/externado_users/externado_users.service';

@Injectable()
export class ExternadoResponsibleTypeService {
  constructor(
    @InjectRepository(ExternadoResponsibleType)
    private readonly externadoResponsibleTypeRepository: Repository<ExternadoResponsibleType>,

    private readonly externadoUsersService:ExternadoUsersService
  )
  {}
  
  //Metodo que extraera todos los tipos de responsables
  async getResponsibleTypes(uuid: string) {

    const user = await this.externadoUsersService.findOneByUUID(uuid);

    if(!user){
      throw new UnauthorizedException("No tiene permisos para ver este contenido");
    }

    return await this.externadoResponsibleTypeRepository.find({
      order: {
        idexternado_responsible_type: 'ASC',
      },
    });
  }

  //Metodo que extraera aquellos tipos de responsables que aun no estan creados para el usuario que hace la consulta
  async getResponsibleTypesLeftJoin(uuid: string) {

    const user = await this.externadoUsersService.findOneByUUID(uuid);

    if(!user){
      throw new UnauthorizedException("No tiene permisos para ver este contenido");
    }

    const externado_user_id = user.idexternado_user;

    return await this.externadoResponsibleTypeRepository.query('select * from externadodb.externado_responsible_type where idexternado_responsible_type not in (select externado_responsible_type_id from externadodb.externado_responsible where externado_user_id = '+ externado_user_id +')');

  }
  
}
