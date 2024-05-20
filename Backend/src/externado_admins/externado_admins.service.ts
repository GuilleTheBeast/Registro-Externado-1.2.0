import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ExternadoAdmin } from './entities/externado_admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternadoUsersService } from 'src/externado_users/externado_users.service';
import { UpdateExternadoAdminDto } from './dto/update-externado_admin.dto';
import { UpdateExternadoUserDto } from 'src/externado_users/dto/update-externado_user.dto';
import { ExternadoStudentService } from 'src/externado_student/externado_student.service';
import { UpdateExternadoStudentDto } from 'src/externado_student/dto/update-externado_student.dto';
import { UpdateExternadoResponsibleDto } from 'src/externado_responsible/dto/update-externado_responsible.dto';
import { ExternadoResponsibleService } from 'src/externado_responsible/externado_responsible.service';


@Injectable()
export class ExternadoAdminsService {
  constructor(
    @InjectRepository(ExternadoAdmin)
    private readonly externadoAdminRepository: Repository<ExternadoAdmin>,
    private readonly externadoUsersService:ExternadoUsersService,
    private readonly externadoStudentService:ExternadoStudentService,
    private readonly externadoResponsibleService:ExternadoResponsibleService
  )
  {}

  async findAll() {
    return await this.externadoAdminRepository.find({
      relations: ["externadoUser"],
  });
  }

  //Metodo que crea/actualiza administradores por parte del Super Admin
  async createEditAdmin(externado_admin: UpdateExternadoAdminDto, uuid: string){
    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
    const externado_user_id = externado_admin.externado_user_id;
    const externadoadmin = await this.externadoAdminRepository.findOneBy({externado_user_id});

    let message = "";
    let statuscode = 0;

    if(externado_user){//Verificamos si existe el usuario que consulta
      if(externado_user.externado_user_type_id === 1){//Verificamos si el usuario es Super Admin
        if(externado_admin.externado_user_type_id === 2){
          if(externadoadmin){//Verificamos si ya existe informacion del usuario que se volvera administrador, si existe, se actualizara, caso contrario, se creara
            
            await this.externadoAdminRepository.save(externado_admin);
            await this.externadoUsersService.updateUserType(externado_admin.externado_user_id, externado_admin.externado_user_type_id, externado_admin.externado_admin_active);

            message = "Administrador actualizado con exito";
            statuscode = 200;
          }else{
            await this.externadoAdminRepository.save(externado_admin);
            await this.externadoUsersService.updateUserType(externado_admin.externado_user_id, externado_admin.externado_user_type_id, externado_admin.externado_admin_active);

            message = "Administrador creado con exito";
            statuscode = 200;
          }
        }else if(externado_admin.externado_user_type_id === 3){
          if(externadoadmin){//Verificamos si ya existe informacion del usuario en la tabla de administradores. Si existe, ya que se cambiara a "Responsable", el registro directo de administrador se inactivara
            await this.externadoAdminRepository.update(externado_admin.externado_user_id, {externado_admin_active: false});
          }
          await this.externadoUsersService.updateUserType(externado_admin.externado_user_id, externado_admin.externado_user_type_id, externado_admin.externado_admin_active);
          message = "Responsable actualizado con exito";
          statuscode = 200;
        }else if(externado_admin.externado_user_type_id === 4){
          if(externadoadmin){//Verificamos si ya existe informacion del usuario en la tabla de administradores. Si existe, ya que se cambiara a "Asistente", el registro directo de administrador se inactivara
            await this.externadoAdminRepository.update(externado_admin.externado_user_id, {externado_admin_active: false});
          }
          await this.externadoUsersService.updateUserType(externado_admin.externado_user_id, externado_admin.externado_user_type_id, externado_admin.externado_admin_active);
          message = "Asistente actualizado con exito";
          statuscode = 200;
        }
      }else{
        throw new UnauthorizedException('El usuario que realiza la consulta no posee los permisos necesarios');
      }

    }else{
      throw new UnauthorizedException('No existe el usuario con el que realiza la consulta');
    }

    return {
      message: message,
      statuscode: statuscode
    };
  }

  //Metodo que activa o inactiva usuarios "normales", este metodo lo utilizaran solo Administradores Normales
  async editStatusResponsible(externado_admin: UpdateExternadoUserDto, uuid: string){
    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
    const idexternado_user = externado_admin.idexternado_user;
    const externadoadmin = await this.externadoUsersService.findOneById(idexternado_user);

    let message = "";
    let statuscode = 0;

    if(externado_user){//Verificamos si existe el usuario que consulta
      if(externado_user.externado_user_type_id === 2){//Verificamos si el usuario es Admin
        if(externadoadmin){//Verificamos que el usuario a activar/inactivar exista
          if(externadoadmin.externado_user_type_id === 3 || externadoadmin.externado_user_type_id === 4){
            await this.externadoUsersService.updateActive(externado_admin.idexternado_user, externado_admin.externado_active_user);

            message = "Usuario actualizado exitosamente";
            statuscode = 200;
          }
        }else{
          throw new UnauthorizedException('El usuario que realiza la consulta no posee los permisos necesarios');
        }

      }else{
        throw new UnauthorizedException('El usuario que realiza la consulta no posee los permisos necesarios');
      }

    }else{
      throw new UnauthorizedException('No existe el usuario con el que realiza la consulta');
    }

    return {
      message: message,
      statuscode: statuscode
    };
  }

  //Metodo que extrae la informacion de todos los estudiantes en el sistema
  async studentList(uuid: string, nombre?: string, page: number = 1, limit: number = 10, paginated: string = 'false'){
    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
    let studentsList;
    const pagination = {
      page: page,
      limit: limit,
      paginated: paginated
    }    
    if(externado_user){
      if((externado_user.externado_user_type_id === 1 || externado_user.externado_user_type_id === 2  || externado_user.externado_user_type_id === 4)){
          studentsList = await this.externadoStudentService.findAllRelatedWithUser(pagination, nombre);
      }else{
        throw new UnauthorizedException('El usuario que realiza la consulta no posee los permisos necesarios');
      }

    }else{
      throw new UnauthorizedException('No existe el usuario con el que realiza la consulta');
    }

    return studentsList;
  }

  //Metodo solo para administradores para inactivar un estudiante o "finalizar" el proceso de matricula para el periodo actual
  async editStudentByAdmins(updateExternadoStudentDto: UpdateExternadoStudentDto, uuid: string){
    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
    const idexternado_student = updateExternadoStudentDto.idexternado_student;
    const externadostudent = await this.externadoStudentService.findByStudentIDEncript(idexternado_student);

    let message = "";
    let statuscode = 0;

    if(externado_user){//Verificamos si existe el usuario que consulta
      if((externado_user.externado_user_type_id === 1 || externado_user.externado_user_type_id === 2)){//Verificamos si el usuario es Admin
        if(externadostudent){//Verificamos que el usuario a activar/inactivar exista
          await this.externadoStudentService.updateStudentByAdmins(updateExternadoStudentDto);

          message = "Estudiante actualizado exitosamente";
          statuscode = 200;
        }else{
          throw new NotFoundException("No se ha encontrado información");
        }

      }else{
        throw new UnauthorizedException('El usuario que realiza la consulta no posee los permisos necesarios');
      }

    }else{
      throw new UnauthorizedException('No existe el usuario con el que realiza la consulta');
    }

    return {
      message: message,
      statuscode: statuscode
    };
  }

  //Metodo que buscara a partir del UUID del JWT, el ID del usuario correspondiente y luego el estudiantes relacionado a el. Es igual
  //que el de arriba pero para usarlo con metodo GET
  async studentGet(uuid: string, id: number){
    
    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
    let externado_student;

    if(externado_user){//Verificamos si existe el usuario que consulta
      if((externado_user.externado_user_type_id === 1 || externado_user.externado_user_type_id === 2)){//Verificamos si el usuario es Admin
        
        externado_student = await this.externadoStudentService.findByStudentIDEncript(id);//Buscamos el estudiante especifico

        if(!externado_student){
          throw new NotFoundException("No se ha encontrado información");
        }

      }else{
        throw new UnauthorizedException('El usuario que realiza la consulta no posee los permisos necesarios');
      }

    }else{
      throw new UnauthorizedException('No existe el usuario con el que realiza la consulta');
    }

    return externado_student;
  }

  //Metodo que buscara a partir del UUID del JWT, el ID del usuario correspondiente y luego el responsable relacionado a el. Es igual
  async responsibleGet(uuid: string, id: number){
    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
    let externado_responsible;

    if(externado_user){//Verificamos si existe el usuario que consulta
      if((externado_user.externado_user_type_id === 1 || externado_user.externado_user_type_id === 2)){//Verificamos si el usuario es Admin
        
        externado_responsible = await this.externadoResponsibleService.findByResponsibleIDEncript(id);//Buscamos el estudiante especifico

        if(!externado_responsible){
          throw new NotFoundException("No se ha encontrado información");
        }

      }else{
        throw new UnauthorizedException('El usuario que realiza la consulta no posee los permisos necesarios');
      }

    }else{
      throw new UnauthorizedException('No existe el usuario con el que realiza la consulta');
    }

    return externado_responsible;
  }

  //Metodo que extrae la informacion de todos los estudiantes en el sistema
  async responsiblesByStudent(updateExternadoResponsibleDto: UpdateExternadoResponsibleDto, uuid: string){
    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
    let responsibleList;

    if(externado_user){//Verificamos si existe el usuario que consulta
      if((externado_user.externado_user_type_id === 1 || externado_user.externado_user_type_id === 2)){//Verificamos si el usuario es Admin

        responsibleList = await this.externadoResponsibleService.findByUserID(updateExternadoResponsibleDto.externado_user_id);

      }else{
        throw new UnauthorizedException('El usuario que realiza la consulta no posee los permisos necesarios');
      }

    }else{
      throw new UnauthorizedException('No existe el usuario con el que realiza la consulta');
    }

    return responsibleList;
  }

}
