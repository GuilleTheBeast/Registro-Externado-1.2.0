import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternadoStudentResponsibleType } from './entities/externado_student_responsible_type.entity';
import { ExternadoUsersService } from 'src/externado_users/externado_users.service';

@Injectable()
export class ExternadoStudentResponsibleTypeService {
  constructor(
    @InjectRepository(ExternadoStudentResponsibleType)
    private readonly externadoStudentResponsibleTypeRepository: Repository<ExternadoStudentResponsibleType>,

    private readonly externadoUsersService:ExternadoUsersService
  )
  {}
  
  async getStudentRespType(uuid: string) {

    const user = await this.externadoUsersService.findOneByUUID(uuid);

    if(!user){
      throw new UnauthorizedException("No tiene permisos para ver este contenido");
    }

    return await this.externadoStudentResponsibleTypeRepository.find({
      order: {
      idexternado_student_responsible_type: 'ASC',
    },
  });
  }
}
