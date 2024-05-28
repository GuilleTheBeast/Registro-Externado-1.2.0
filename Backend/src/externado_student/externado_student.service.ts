import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateExternadoStudentDto } from './dto/update-externado_student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ExternadoStudent } from './entities/externado_student.entity';
import { ExternadoUsersService } from 'src/externado_users/externado_users.service';
import { ExternadoSequenceService } from 'src/externado_sequence/externado_sequence.service';

@Injectable()
export class ExternadoStudentService {
  private readonly logger = new Logger(ExternadoStudentService.name);
  constructor(
    @InjectRepository(ExternadoStudent)
    private readonly externadoStudentRepository: Repository<ExternadoStudent>,

    private readonly externadoUsersService:ExternadoUsersService,
    private readonly externadoSequenceService:ExternadoSequenceService,
   
  )
  {}
  
  async findAll(){
    return await this.externadoStudentRepository.find();
  }

  async findAllRelatedWithUser(pagination: { page: number, limit: number, paginated: string }, nombre?: string){
    const where = nombre ? { externado_student_firstname: Like(`%${nombre}%`) } : {};     
    const isPaginated = pagination.paginated === 'true' ? true : false;    
    if (isPaginated ) {
        const total = await this.externadoStudentRepository.count({ where });
        const offset = (pagination.page - 1) * pagination.limit;
        const limit = pagination.limit;
        let data = []
        if(nombre){
          data = await this.externadoStudentRepository.find({
            relations: ["externadoUser"],
            where,
          });
          pagination.page = 1
        } else {
          data = await this.externadoStudentRepository.find({
            relations: ["externadoUser"],
            where,
            take: limit,
            skip: offset,
        });
        }
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            totalPages: Number(totalPages),
            currentPage: Number(pagination.page),
            perPage: Number(pagination.limit),
        };
    } else {
      return await this.externadoStudentRepository.find({
        relations: ["externadoUser"],
        where
    });
    }
}
  // Para reporteria
  getStudents(){
    return this.externadoStudentRepository.find();
  }


  //Se ocupa el UPDATE DTO para esta entidad ya que las validaciones de cuales son los campos son mandatorios dependera de las validaciones
  //del frontend
  async registerStudent(uuid: string, updateExternadoStudentDto: UpdateExternadoStudentDto) {

    const externado_user_id = await this.externadoUsersService.findOneByUUID(uuid);//Encontramos el usuario al que se le asignara el Estudiante
    const sequences = await this.externadoSequenceService.findOneById(1);//Buscamos el registro de Sequences para posteriormente extraer el Sequence correspondiente a Estudiantes
    const idexternado_student_sequence = sequences.idexternado_student_sequence;//Sacamos el siguiente ID para Estudiantes

    //Asignamos los valores previamente buscados a la informacion que viene desde el frontend
    updateExternadoStudentDto.idexternado_student = idexternado_student_sequence;
    updateExternadoStudentDto.externado_user_id = externado_user_id.idexternado_user;

    let message = "";
    let statuscode = 0;

    try {
      await this.externadoStudentRepository.save(updateExternadoStudentDto);

      sequences.idexternado_student_sequence = (idexternado_student_sequence + 1);//Actualizamos la sequencia de estudiante incrementando en 1
      await this.externadoSequenceService.updateSequences(sequences);//Actualizamos el registro de sequencias

      message = "Estudiante creado con exito";
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

  //Metodo para actualizar un Estudiante. Como principal validacion es una busqueda de que el registro existe previo a su actualizacion
  //Esta busqueda se realizara con el ID del registro enviado y el UUID del JWT para evitar que por algun motivo se quiera actualizar
  //el registro solo por cambiar el ID del estudiante en el JSON.
  async updateStudent(uuid: string, updateExternadoStudentDto: UpdateExternadoStudentDto) {

    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Encontramos el usuario al que se le actualizara el Estudiante
    const idexternado_student = updateExternadoStudentDto.idexternado_student;//Identificamos el ID del Estudiante que se debe actualizar

    if(!externado_user){//Si no existe el usuario mediante UUID, tirara error
      throw new NotFoundException("No se ha encontrado el usuario a actualizar");
    }

    const externado_user_id = externado_user.idexternado_user;//Sacamos el ID del usuario que encontramos por medio del UUID
    const studentExist = await this.externadoStudentRepository.findOneBy({idexternado_student, externado_user_id});//Vemos si existe el registro a actualizarse

    if(!studentExist){//Si no existe el registro, tirara error
      throw new NotFoundException("No se ha encontrado el usuario a actualizar");
    }

    let message = "";
    let statuscode = 0;

    try {

      await this.externadoStudentRepository.save(updateExternadoStudentDto);//Actualizamos el registro

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

  //Metodo para borrar un Estudiante de la BD. Como principal validacion es una busqueda de que el registro existe previo a su eliminacion
  //Esta busqueda se realizara con el ID del registro enviado y el UUID del JWT para evitar que por algun motivo se quiera borrar
  //un registro solo por cambiar el ID del estudiante en el JSON.
  async deleteStudent(uuid: string, updateExternadoStudentDto: UpdateExternadoStudentDto) {

    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Encontramos el usuario al que se le actualizara el Estudiante
    const idexternado_student = updateExternadoStudentDto.idexternado_student;//Identificamos el ID del Estudiante que se debe actualizar

    if(!externado_user){//Si no existe el usuario mediante UUID, tirara error
      throw new NotFoundException("No se ha encontrado el usuario a actualizar");
    }

    const externado_user_id = externado_user.idexternado_user;//Sacamos el ID del usuario que encontramos por medio del UUID
    const studentExist = await this.externadoStudentRepository.findOneBy({idexternado_student, externado_user_id});//Vemos si existe el registro a actualizarse

    if(!studentExist){//Si no existe el registro, tirara error
      throw new NotFoundException("No se ha encontrado el usuario a actualizar");
    }

    let message = "";
    let statuscode = 0;

    try {

      await this.externadoStudentRepository.remove(studentExist);//Removemos el registro

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
    return await this.externadoStudentRepository.findBy({externado_user_id});
  }

  async findByStudentID(externado_user_id: number, idexternado_student: number) {
    return await this.externadoStudentRepository.findOneBy({idexternado_student, externado_user_id});
  }

  async findByStudentIDEncript(idexternado_student: number) {
    return await this.externadoStudentRepository.findOneBy({idexternado_student});
  }

  async updateStudentEncript(id: number, updateExternadoStudentDto: UpdateExternadoStudentDto){
    return await this.externadoStudentRepository.update(id, {
      externado_student_address: updateExternadoStudentDto.externado_student_address,
      externado_student_phone: updateExternadoStudentDto.externado_student_phone,
      externado_student_email: updateExternadoStudentDto.externado_student_email,
      externado_student_siblings: updateExternadoStudentDto.externado_student_siblings
    })
  }

  //Metodo para extraer toda la informacion necesaria para el llenado de los formularios requeridos por el externado. Este metodo
  //extraera la informacion de estudiantes y los catalogos con los que se relaciona
  async pdfStudent(uuid: string, updateExternadoStudentDto: UpdateExternadoStudentDto) {

    const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Encontramos el usuario con el que esta relacionado el Estudiante
    const idexternado_student = updateExternadoStudentDto.idexternado_student;//Sacamos el id del estudiante al que se le generara el pdf

    if(!externado_user){//Si no existe el usuario mediante UUID, tirara error
      throw new NotFoundException("No se ha encontrado el usuario a actualizar");
    }

    const externado_user_id = externado_user.idexternado_user;//Sacamos el ID del usuario que encontramos por medio del UUID
    const studentExist = await this.externadoStudentRepository.findOneBy({idexternado_student, externado_user_id});//Vemos si existe el registro a relacion user-student

    if(!studentExist){//Si no existe el registro, tirara error
      throw new NotFoundException("No se ha encontrado el usuario a actualizar");
    }

    try {
      //Se sacara el estudiante relacionado al usuario que esta logueado en el sistema
      const infoStudent = await this.externadoStudentRepository.createQueryBuilder('estudiante')
      .leftJoinAndSelect('estudiante.externadoDepartment', 'externadoDepartment')
      .leftJoinAndSelect('estudiante.externadoLevel', 'externadoLevel')
      .leftJoinAndSelect('estudiante.externadoChurch', 'externadoChurch')
      .leftJoinAndSelect('estudiante.externadoStudRespType', 'externadoStudRespType')
      .where('estudiante.idexternado_student = ' + studentExist.idexternado_student)
      .getOne();


      return infoStudent;

    } catch (e) {
      const message = "Ha ocurrido un error, favor volver a intentarlo";
      this.logger.error(e);
      throw new BadRequestException(message);
    }

  }

  //Metodo para editar estudiantes desde las opciones de administracion
  async updateStudentByAdmins(updateExternadoStudentDto: UpdateExternadoStudentDto) {

    return await this.externadoStudentRepository.save(updateExternadoStudentDto);

  }

  //Modificamos todos los estudiantes a modo que el campo "externado_proccess_finished" aparezca como "false"
  async updateStudentsNewPeriod() {

    return await this.externadoStudentRepository.createQueryBuilder()
    .update(ExternadoStudent)
    .set({ externado_proccess_finished: false })
    .execute();

  }

  

  async findAllRelatedWithUserFilteredByName(nombre: string) {
    
    return await this.externadoStudentRepository.createQueryBuilder('estudiante')
    .where('estudiante.externado_student_firstname like :nombre', {nombre: '%' + nombre + '%'})
    .getMany();
  }
}
