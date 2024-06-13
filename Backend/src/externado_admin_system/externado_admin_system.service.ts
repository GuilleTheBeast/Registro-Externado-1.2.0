import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternadoAdminSystem } from './entities/externado_admin_system.entity';
import { Repository } from 'typeorm';
import { UpdateExternadoAdminSystemDto } from './dto/update-externado_admin_system.dto';
import { ExternadoUsersService } from 'src/externado_users/externado_users.service';
import { ExternadoSequenceService } from 'src/externado_sequence/externado_sequence.service';
import { ExternadoStudentService } from 'src/externado_student/externado_student.service';

@Injectable()
export class ExternadoAdminSystemService {
  constructor(
    @InjectRepository(ExternadoAdminSystem)
    private readonly externadoAdminSystemRepository: Repository<ExternadoAdminSystem>,
    private readonly externadoUsersService:ExternadoUsersService,
    private readonly externadoSequenceService:ExternadoSequenceService,
    private readonly externadoStudentService:ExternadoStudentService
  )
  {}

  async findOneByGenPass(externado_generic_pass: string) {
    return await this.externadoAdminSystemRepository.findOneBy({externado_generic_pass});
  }

  async findAll() {
    return await this.externadoAdminSystemRepository.find({
      order: {
      idexternado_admin_system: 'ASC',
    },
  });
  }

  //No deberia existir mas de un periodo activo, por tanto el periodo activo es el actual
  async findOneByLastPeriod() {
    const lastPeriod = await this.externadoSequenceService.findOneById(1);
    return await this.externadoAdminSystemRepository.findOneBy({idexternado_admin_system: (lastPeriod.idexternado_admin_system_sequence - 1)});
  }

  //Crearemos un nuevo periodo de matricula, no debe haber ningun periodo activo para realizar esto
  async createSystemConf(updateExternadoAdminSystemDto:UpdateExternadoAdminSystemDto, uuid: string) {
    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
    const externado_active_period = await this.externadoAdminSystemRepository.findOneBy({externado_active_period: true});

    let message = "";
    let statuscode = 0;

    if(externado_user){//Verificamos si existe el usuario que consulta
      if(externado_user.externado_user_type_id === 1){//Verificamos si el usuario es Super Admin
        if(externado_active_period){//Verificamos si existe un periodo activo, si es asi, debera desactivarse para poder crear uno nuevo
          throw new UnauthorizedException('Para crear un nuevo periodo de matrícula debe inactivar el periodo actual');
          
        }else{
          const genericpass = await this.externadoAdminSystemRepository.findOneBy({externado_generic_pass: updateExternadoAdminSystemDto.externado_generic_pass});
          if(!genericpass){
            const sequences = await this.externadoSequenceService.findOneById(1);//Traemos los registros de sequencias
            const idexternado_admin_system_sequence = sequences.idexternado_admin_system_sequence;//Extraemos el valor de la sequencia para la tabla de usuarios

            updateExternadoAdminSystemDto.idexternado_admin_system = idexternado_admin_system_sequence;
            updateExternadoAdminSystemDto.externado_active_period = true;
            updateExternadoAdminSystemDto.externado_system_closed = true;
            await this.externadoAdminSystemRepository.save(updateExternadoAdminSystemDto);

            sequences.idexternado_admin_system_sequence = (idexternado_admin_system_sequence + 1);//Actualizamos la sequencia de usuarios incrementando en 1          
            await this.externadoSequenceService.updateSequences(sequences);//Actualizamos el registro de sequencias

            await this.externadoStudentService.updateStudentsNewPeriod();//Al crear un nuevo periodo, todos los estudiantes que hayan sido marcados como que su proceso ya finalizo, volveran a estar disponibles para su modificacion

            message = "Se ha creado un nuevo periodo de matrícula exitosamente";
            statuscode = 200;
          }else{
            throw new UnauthorizedException('El Código de acceso que se quiere asignar ya fue utilizado, favor seleccionar otro');
          }
        }

      }else{
        throw new UnauthorizedException('El usuario que realiza la creación no posee los permisos necesarios');
      }

    }else{
      throw new UnauthorizedException('No existe el usuario con el que realiza la creación');
    }

    return {
      message: message,
      statuscode: statuscode
    };
  }

  //Metodo para actualizar el periodo vigente, unicamente se podra activar/inactivar el periodo o activar/inactivar el sistema de manera administrativa con ese periodo
  async updateSystemConf(updateExternadoAdminSystemDto:UpdateExternadoAdminSystemDto, uuid: string) {
    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
    const externado_active_period = await this.externadoAdminSystemRepository.findOneBy({idexternado_admin_system: updateExternadoAdminSystemDto.idexternado_admin_system});

    let message = "";
    let statuscode = 0;

    if(externado_user){//Verificamos si existe el usuario que consulta
      if(externado_user.externado_user_type_id === 1){//Verificamos si el usuario es Super Admin
        if(externado_active_period){//Verificamos si existe el periodo a actualizar
          await this.externadoAdminSystemRepository.save(updateExternadoAdminSystemDto);

          message = "Se ha actualizado el periodo de matrícula exitosamente";
          statuscode = 200;
          
        }else{
          throw new UnauthorizedException('El periodo consultado no existe');
        }

      }else{
        throw new UnauthorizedException('El usuario que realiza la creación no posee los permisos necesarios');
      }

    }else{
      throw new UnauthorizedException('No existe el usuario con el que realiza la creación');
    }

    return {
      message: message,
      statuscode: statuscode
    };
  }

  //Metodo para visualizar todos los periodos de matricula anteriores incluido el actual
  async historicalPeriod() {
    return await this.externadoAdminSystemRepository.find({
      order: {
      idexternado_admin_system: 'DESC',
    },
  });

  }

}
