import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternadoDepartment } from './entities/externado_department.entity';
import { ExternadoUsersService } from 'src/externado_users/externado_users.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ExternadoDepartmentService {
  constructor(
    @InjectRepository(ExternadoDepartment)
    private readonly externadoDepartmentRepository: Repository<ExternadoDepartment>,

    private readonly externadoUsersService:ExternadoUsersService
  )
  {}

  async getDepartments(uuid: string) {

    const user = await this.externadoUsersService.findOneByUUID(uuid);

    if(!user){
      throw new UnauthorizedException("No tiene permisos para ver este contenido");
    }

    return await this.externadoDepartmentRepository.find({
      order: {
      idexternado_departments: 'ASC',
    },
  });
  }

}
