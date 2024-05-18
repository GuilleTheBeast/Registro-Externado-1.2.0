import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternadoUser } from './entities/externado_user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UpdateExternadoUserDto } from './dto/update-externado_user.dto';


@Injectable()
export class ExternadoUsersService {

  constructor(
    @InjectRepository(ExternadoUser)
    private readonly externadoUserRepository: Repository<ExternadoUser>,
  )
  {}

  async createUser(createExternadoUserDto: RegisterDto){
    return await this.externadoUserRepository.save(createExternadoUserDto);
  }

  async findAll() {
    return await this.externadoUserRepository.find();
  }

  async findOneById(idexternado_user: number) {
    return await this.externadoUserRepository.findOneBy({idexternado_user});
  }

  async findOneByUUID(externado_uuid: string) {
    return await this.externadoUserRepository.findOneBy({externado_uuid});
  }

  async findOneByEmail(externado_email: string) {
    return await this.externadoUserRepository.findOneBy({externado_email});
  }

  //Metodo para activar el usuario por medio de la verificacion del correo electronico
  async activeEmail(uuid: string){
      
    const externado_user = await this.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID

    let message = "";
    let statuscode = 0;

    if(externado_user){//Existe un usuario para verificar
      if(!externado_user.externado_active_email){//Aun no se ha verificado el usuario?

        await this.externadoUserRepository.update(externado_user.idexternado_user, {externado_active_email: true});
        
        message = "Usuario activado exitosamente"
        statuscode = 200;

      }else{
        message = "Este usuario ya está activado"
        statuscode = 204;
      }

    }else{
      throw new UnauthorizedException('No se encuentra ningun usuario para activar');
    }

    return {
      message: message,
      statuscode: statuscode
    }

  }

  //Metodo traer todos los usuarios, tanto administradores como padres de familia
  async userSuperGet(uuid: string){
      
    const externado_user = await this.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID

    let infoResponsibles;

    if(externado_user){//Como doble validacion, verificamos el UUID para ver que sea de un usuario que exista
      if(externado_user.externado_user_type_id === 1){//Verificamos que este usuario sea Super Admin

        infoResponsibles = await this.externadoUserRepository.createQueryBuilder('users')
        .where('users.externado_user_type_id not in (1)').getMany();

      }else{
        throw new UnauthorizedException('El usuario que realiza la consulta no posee los permisos necesarios');
      }

    }else{
      throw new UnauthorizedException('No existe el usuario con el que realiza la consulta');
    }

    return infoResponsibles;

  }

   //Metodo traer todos los usuarios padres de familia
   async userAdminGet(uuid: string){
      
    const externado_user = await this.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID

    let infoResponsibles;

    if(externado_user){//Como doble validacion, verificamos el UUID para ver que sea de un usuario que exista
      if(externado_user.externado_user_type_id === 2){//Verificamos que este usuario sea Admin

        infoResponsibles = await this.externadoUserRepository.createQueryBuilder('users')
        .where('users.externado_user_type_id not in (1, 2)').getMany();

      }else{
        throw new UnauthorizedException('El usuario que realiza la consulta no posee los permisos necesarios');
      }

    }else{
      throw new UnauthorizedException('No existe el usuario con el que realiza la consulta');
    }

    return infoResponsibles;

  }

  //Metodo traer todos los usuarios padres de familia
  async userAssistantGet(uuid: string){
      
    const externado_user = await this.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID

    let infoResponsibles;

    if(externado_user){//Como doble validacion, verificamos el UUID para ver que sea de un usuario que exista
      if(externado_user.externado_user_type_id === 4){//Verificamos que este usuario sea Asistente

        infoResponsibles = await this.externadoUserRepository.createQueryBuilder('users')
        .where('users.externado_user_type_id not in (1, 2, 3)').getMany();

      }else{
        throw new UnauthorizedException('El usuario que realiza la consulta no posee los permisos necesarios');
      }

    }else{
      throw new UnauthorizedException('No existe el usuario con el que realiza la consulta');
    }

    return infoResponsibles;

  }

  async updatePassGenerated(idexternado_user, externado_pass){
    await this.externadoUserRepository.update(idexternado_user, {externado_pass: externado_pass, externado_reset_password: true});
  }

  async updateCustomPass(idexternado_user, externado_pass){
    await this.externadoUserRepository.update(idexternado_user, {externado_pass: externado_pass, externado_reset_password: false});
  }

  async updateUserMasiveUpload(idexternado_user){
    await this.externadoUserRepository.update(idexternado_user, {externado_active_email: true});
  }

  async updateUserEncript(id: number, updateExternadoUserDto: UpdateExternadoUserDto){
    return await this.externadoUserRepository.update(id, {
      externado_pass: updateExternadoUserDto.externado_pass,
      externado_uuid: updateExternadoUserDto.externado_uuid
    })
  }

  async getUserInfoSuper(id: number, uuid: string){
    const externado_user = await this.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID

    let infoAdmins;

    if(externado_user){//Como doble validacion, verificamos el UUID para ver que sea de un usuario que exista
      if(externado_user.externado_user_type_id === 1){//Verificamos que este usuario sea Super Admin

        infoAdmins = this.externadoUserRepository.query('select * from externadodb.externado_user eu left join externadodb.externado_admin ea on (eu.idexternado_user = ea.externado_user_id) where eu.idexternado_user = '+ id);

      }else{
        throw new UnauthorizedException('El usuario que realiza la consulta no posee los permisos necesarios');
      }

    }else{
      throw new UnauthorizedException('No existe el usuario con el que realiza la consulta');
    }

    return infoAdmins;
  }

  async updateUserType(idexternado_user: number, user_type_id: number, active_user: boolean){
    return await this.externadoUserRepository.update(idexternado_user, {externado_user_type_id: user_type_id, externado_active_user: active_user})
  }

  async updateActive(idexternado_user: number, active_user: boolean){
    return await this.externadoUserRepository.update(idexternado_user, {externado_active_user: active_user})
  }

}