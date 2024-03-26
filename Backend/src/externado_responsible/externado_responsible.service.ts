import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateExternadoResponsibleDto } from './dto/update-externado_responsible.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternadoResponsible } from './entities/externado_responsible.entity';
import { ExternadoUsersService } from 'src/externado_users/externado_users.service';
import { ExternadoSequenceService } from 'src/externado_sequence/externado_sequence.service';

@Injectable()
export class ExternadoResponsibleService {
  private readonly logger = new Logger(ExternadoResponsibleService.name);
  constructor(
    @InjectRepository(ExternadoResponsible)
    private readonly externadoResponsibleRepository: Repository<ExternadoResponsible>,

    private readonly externadoUsersService:ExternadoUsersService,
    private readonly externadoSequenceService:ExternadoSequenceService,
  )
  {}
  
  //Se ocupa el UPDATE DTO para esta entidad ya que las validaciones de cuales son los campos son mandatorios dependera de las validaciones
  //del frontend
  async createResponsible(uuid: string, updateExternadoResponsibleDto: UpdateExternadoResponsibleDto) {

    const externado_user_id = await this.externadoUsersService.findOneByUUID(uuid);//Encontramos el usuario al que se le asignara el Responsable
    const sequences = await this.externadoSequenceService.findOneById(1);//Buscamos el registro de Sequences para posteriormente extraer el Sequence correspondiente a Responsables
    const idexternado_responsible_sequence = sequences.idexternado_responsible_sequence;//Sacamos el siguiente ID para Responsables

    //Asignamos los valores previamente buscados a la informacion que viene desde el frontend
    updateExternadoResponsibleDto.idexternado_responsible = idexternado_responsible_sequence;
    updateExternadoResponsibleDto.externado_user_id = externado_user_id.idexternado_user;

    let message = "";
    let statuscode = 0;

    try {
      await this.externadoResponsibleRepository.save(updateExternadoResponsibleDto);

      sequences.idexternado_responsible_sequence = (idexternado_responsible_sequence + 1);//Actualizamos la sequencia de responsables incrementando en 1
      await this.externadoSequenceService.updateSequences(sequences);//Actualizamos el registro de sequencias

      message = "Representante creado con exito";
      statuscode = 201;
    } catch (e) {
      message = "Ha ocurrido un error, favor volver a intentarlo";
      this.logger.error(e);
      throw new BadRequestException(message);
    }

    return {
      message: message,
      statuscode: statuscode
    };
  }

  //Metodo para actualizar un Responsable. Como principal validacion es una busqueda de que el registro existe previo a su actualizacion
  //Esta busqueda se realizara con el ID del registro enviado y el UUID del JWT para evitar que por algun motivo se quiera actualizar
  //el registro solo por cambiar el ID del reponsable en el JSON.
  async updateResponsible(uuid: string, updateExternadoResponsibleDto: UpdateExternadoResponsibleDto) {

    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Encontramos el usuario al que se le actualizara el Responsable
    const idexternado_responsible = updateExternadoResponsibleDto.idexternado_responsible;//Identificamos el ID del Responsable que se debe actualizar

    if(!externado_user){//Si no existe el usuario buscado con UUID, tirara error
      throw new NotFoundException("No se ha encontrado el usuario a actualizar");
    }

    const externado_user_id = externado_user.idexternado_user;//Sacamos el ID del usuario que encontramos por medio del UUID
    const responsibleExist = await this.externadoResponsibleRepository.findOneBy({idexternado_responsible, externado_user_id});//Vemos si existe el registro a actualizarse

    if(!responsibleExist){//Si no existe el registro, tirara error
      throw new NotFoundException("No se ha encontrado el usuario a actualizar");
    }

    let message = "";
    let statuscode = 0;

    try {

      await this.externadoResponsibleRepository.save(updateExternadoResponsibleDto);//Actualizamos el registro

      message = "Representante actualizado con exito";
      statuscode = 200;

    } catch (e) {
      message = "Ha ocurrido un error, favor volver a intentarlo";
      this.logger.error(e);
      throw new BadRequestException(message);
    }

    return {
      message: message,
      statuscode: statuscode
    };
  }

  //Metodo para eliminar un Responsable. Como principal validacion es una busqueda de que el registro existe previo a su actualizacion
  //Esta busqueda se realizara con el ID del registro enviado y el UUID del JWT para evitar que por algun motivo se quiera eliminar
  //el registro solo por cambiar el ID del reponsable en el JSON.
  async deleteResponsible(uuid: string, updateExternadoResponsibleDto: UpdateExternadoResponsibleDto) {

    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Encontramos el usuario al que se le actualizara el Responsable
    const idexternado_responsible = updateExternadoResponsibleDto.idexternado_responsible;//Identificamos el ID del Responsable que se debe actualizar

    if(!externado_user){//Si no existe el usuario buscado con UUID, tirara error
      throw new NotFoundException("No se ha encontrado el usuario a actualizar");
    }

    const externado_user_id = externado_user.idexternado_user;//Sacamos el ID del usuario que encontramos por medio del UUID
    const responsibleExist = await this.externadoResponsibleRepository.findOneBy({idexternado_responsible, externado_user_id});//Vemos si existe el registro a actualizarse

    if(!responsibleExist){//Si no existe el registro, tirara error
      throw new NotFoundException("No se ha encontrado el usuario a actualizar");
    }

    let message = "";
    let statuscode = 0;

    try {

      await this.externadoResponsibleRepository.remove(responsibleExist);//Removemos el registro

      message = "Representante eliminado con exito";
      statuscode = 200;

    } catch (e) {
      message = "Ha ocurrido un error, favor volver a intentarlo";
      this.logger.error(e);
      throw new BadRequestException(message);
    }

    return {
      message: message,
      statuscode: statuscode
    };
  }

  async findByUserID(externado_user_id: number) {
    return await this.externadoResponsibleRepository.findBy({externado_user_id});
  }

  async findByResponsibleID(externado_user_id: number, idexternado_responsible: number) {
    return await this.externadoResponsibleRepository.findOneBy({idexternado_responsible, externado_user_id});
  }

  async findByResponsibleIDEncript(idexternado_responsible: number) {
    return await this.externadoResponsibleRepository.findOneBy({idexternado_responsible});
  }

  async updateResponsibleEncript(id: number, updateExternadoResponsibleDto: UpdateExternadoResponsibleDto){
    return await this.externadoResponsibleRepository.update(id, {
      externado_address: updateExternadoResponsibleDto.externado_address,
      externado_work_phone: updateExternadoResponsibleDto.externado_work_phone
    })
  }

  //Metodo para extraer toda la informacion necesaria para el llenado de los formularios requeridos por el externado. Este metodo
  //extraera la informacion de responsables y los catalogos con los que se relacionan
  async pdfResponsibles(uuid: string) {

    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Encontramos el usuario con el que esta relacionado el responsable

    if(!externado_user){//Si no existe el usuario mediante UUID, tirara error
      throw new NotFoundException("No se ha encontrado el usuario a actualizar");
    }

    const externado_user_id = externado_user.idexternado_user;//Sacamos el ID del usuario que encontramos por medio del UUID

    try {
      //Se sacaran todos los responsables relacionados al usuario que esta logueado en el sistema
      const infoResponsibles = await this.externadoResponsibleRepository.createQueryBuilder('responsables')
      .leftJoinAndSelect('responsables.externadoDepartment', 'externadoDepartment')
      .leftJoinAndSelect('responsables.externadoPEP', 'externadoPEP')
      .leftJoinAndSelect('responsables.externado3yearsPEP', 'externadoPEP3')
      .leftJoinAndSelect('responsables.externadoIncomings', 'externadoIncomings')
      .leftJoinAndSelect('responsables.externadoRespType', 'externadoRespType')
      .where('responsables.externado_user_id = ' + externado_user_id).getMany();


      return infoResponsibles;

    } catch (e) {
      const message = "Ha ocurrido un error, favor volver a intentarlo";
      this.logger.error(e);
      throw new BadRequestException(message);
    }
  }
}
