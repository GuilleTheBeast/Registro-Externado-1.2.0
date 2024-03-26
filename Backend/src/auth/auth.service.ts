import { ExternadoUsersService } from 'src/externado_users/externado_users.service';
import { ExternadoAdminSystemService } from 'src/externado_admin_system/externado_admin_system.service';
import { ExternadoSequenceService } from 'src/externado_sequence/externado_sequence.service';
import { ExternadoStudentService } from 'src/externado_student/externado_student.service';
import { ExternadoResponsibleService } from 'src/externado_responsible/externado_responsible.service';
import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { v5 as uuidv5 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ResponsibleDto } from './dto/responsible.dto';
import { StudentDto } from './dto/student.dto';
import { EmailSenderService } from 'src/email_sender/email_sender.service';
import { ResetPassDto } from './dto/resetPass.dto';
import { SetNewPassDto } from './dto/setNewPass.dto';
import { EncriptDto } from './dto/encript.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
    constructor(
        private readonly externadoUsersService:ExternadoUsersService,
        private readonly externadoAdminSystemService:ExternadoAdminSystemService,
        private readonly externadoSequenceService:ExternadoSequenceService,
        private readonly externadoStudentService:ExternadoStudentService,
        private readonly externadoResponsibleService:ExternadoResponsibleService,
        private readonly emailSenderService:EmailSenderService,
        private readonly jwtService: JwtService
    ){}

    //Metodo para registro de usuarios, validara, a partir del TOKEN proporcionado por el Externado, que exista un registro con dicho
    //TOKEN (externado_generic_pass) en la tabla ADMIN SYSTEM, si existe, que pertenezca a un periodo activo y si este periodo activo
    //no tiene "el sistema cerrado" por alguna decision administrativa.
    //Si todo lo anterior esta bien, procedera a guardar un nuevo usuario en el sistema, cifrando su contraseña y creando un UUID que
    //se ocupara en el JWT al momento de loguearse al sistema
    async register(registerDto: RegisterDto) {
        const externado_email = registerDto.externado_email;
        const externado_pass = registerDto.externado_pass;
        const externado_generic_pass = registerDto.externado_generic_pass;
    
        let message = "";
        let statuscode = 0;
    
        try {
          
          const externadoAdminSystem = await this.externadoAdminSystemService.findOneByGenPass(externado_generic_pass);
          const existeUsuario = await this.externadoUsersService.findOneByEmail(externado_email);

          if(!existeUsuario){//Verificamos que no exista ya un usuario con el mismo correo
            if(externadoAdminSystem){//Verificamos si existe algun periodo con el token especificado
              if(externadoAdminSystem.externado_active_period){//Verificamos que el token del Externado sea de un periodo activo
                if(externadoAdminSystem.externado_system_closed){//Verificamos si el sistema esta activo administrativamente o no para dicho periodo
                  const sequences = await this.externadoSequenceService.findOneById(1);//Traemos los registros de sequencias
                  const idexternado_user_sequence = sequences.idexternado_user_sequence;//Extraemos el valor de la sequencia para la tabla de usuarios
                  const uuidValue = externado_email;
                  const namespace = process.env.UUID_GENERATOR;
                  const uuid = uuidv5(uuidValue, namespace);//Creamos un UUID a partir del correo ingresado
                  const salt = 12;
                  const hashedPassword = await bcrypt.hash(externado_pass, salt);//Encriptamos la contraseña ingresada
                  const idexternado_user = idexternado_user_sequence;
    
                  //Asignamos los valores de control y contraseña encryptada
                  registerDto.idexternado_user = idexternado_user_sequence;
                  registerDto.externado_email = externado_email;
                  registerDto.externado_pass = hashedPassword;
                  registerDto.externado_generic_pass = externado_generic_pass;
                  registerDto.externado_uuid = uuid;
    
                  this.externadoUsersService.createUser(registerDto);//Creamos el registro en la base de datos
    
                  sequences.idexternado_user_sequence = (idexternado_user + 1);//Actualizamos la sequencia de usuarios incrementando en 1          
                  await this.externadoSequenceService.updateSequences(sequences);//Actualizamos el registro de sequencias

                  const correoEnviado = await this.emailSenderService.sendVerificationMail(externado_email, uuid);//Se envia correo de verificacion

                  if (correoEnviado) {
                    console.log('Correo electrónico enviado con éxito');
                  } else {
                    console.log('Error al enviar el correo electrónico');
                  }
    
                  message = "Usuario creado con exito";
                  statuscode = 201;

                }else{
                  //El control administrativo del sistema ha inhabilitado el acceso al mismo
                  throw new ServiceUnavailableException("El sistema esta inhabilitado administrativamente de forma temporal, contacte con los administradores del Colegio para mayor información");
                }
              }else{
                //El Código de acceso existe pero corresponde a un periodo que ya expiró
                throw new ForbiddenException("El Código de acceso no corresponde a este periodo de matrícula o el periodo de matrícula ya finalizó");
              }
            }else{
              //El Código de acceso no existe en ningún periodo dentro del sistema
              throw new ForbiddenException("El Código de acceso es incorrecto, favor verificar");
            }
          }else{
            //El usuario a crear ya existe
            throw new ForbiddenException("Cuenta de correo ya existe, favor verificar");
          }
        } catch (e) {
          this.logger.error(e);
          throw new BadRequestException(e);
        }

        return {
          
          message: message,
          statuscode: statuscode
    
        };
      }
    
      //Metodo que verificara las credenciales de usuario ingresadas al sistema y si todo esta bien, creara el JWT para su posterior uso
      //en los demas metodos que requieran autenticacion para su uso
      async login(loginDto: LoginDto) {
    
        const externado_email = loginDto.externado_email;

        let tokenJSON = "";
        let message = "";
        let statuscode = 0;
    
        try {
          const externadoAdminSystem = await this.externadoAdminSystemService.findOneByLastPeriod();//Verificamos que exista un periodo activo
          const usuario = await this.externadoUsersService.findOneByEmail(externado_email);//Realizamos la busqueda por medio del email

          if(usuario){//Si se encontro un usuario existente, procedemos a comparar las contraseñas: la ingresada y la almacenada
            if(usuario.externado_active_user){//Verificamos si el usuario esta activo para ingreso al sistema
              if(usuario.externado_active_email){//Se verifica si el correo ha sido verificado, valga la redundancia
                if(externadoAdminSystem){//Se encontro periodo activo
                  if((externadoAdminSystem.externado_system_closed) || (usuario.externado_user_type_id === 1) || (usuario.externado_user_type_id === 2)){//El periodo activo debe tener "abierto" el sistema. Si quien ingresa es un administrador, estas configuraciones no afectarian
                    if((externadoAdminSystem.externado_active_period) || (usuario.externado_user_type_id === 1) || (usuario.externado_user_type_id === 2)){//El periodo de matricula esta inactivo/activo. Si quien ingresa es un administrador, estas configuraciones no afectarian
                      if(await bcrypt.compare(loginDto.externado_pass, usuario.externado_pass)){
                        
                        const payload = { uuid: usuario.externado_uuid, rol: usuario.externado_user_type_id };//Creamos el payload para el token
                        const token = await this.jwtService.signAsync(payload);

                        tokenJSON = token;
                        message = "El usuario se ha logueado con exito";
                        statuscode = 200;

                        if(usuario.externado_reset_password){
                          message = "El usuario se ha logueado con exito pero debe resetear su contraseña";
                          statuscode = 202;
                        }
                
                      }else{
                        //la contraseña no coincide con la guardada en la base
                        throw new UnauthorizedException('Credenciales erróneas, favor verificarlas');
                      }
                    }else{
                      throw new UnauthorizedException('El periodo de matrícula ha finalizado');
                    }
                  }else{
                    //El control administrativo del sistema ha inhabilitado el acceso al mismo
                    throw new UnauthorizedException('El sistema esta inhabilitado administrativamente de forma temporal, contacte con los administradores del Colegio para mayor información');
                  }
                }else{
                  //Si no existe ningún periodo activo se considera que el periodo de matricula ya finalizo o que administrativamente se ha cambiado a inactivo
                  throw new UnauthorizedException('El periodo de matrícula ha finalizado');
                }
              }else{
                throw new UnauthorizedException('Su correo electrónico no ha sido verificado en el sistema. Favor revisar su correo electrónico (incluido la carpeta SPAM) y seguir los pasos para verificar su cuenta');
              }
            }else{
              //El usuario en específico ha sido inactivado para acceder al sistema
              throw new UnauthorizedException('No tiene permiso de acceso al sistema, favor contactarse con los administradores del sistema');
            }
          }else{
            //El usuario no existe
            throw new UnauthorizedException('Credenciales erróneas, favor verificarlas');
          }
          
        } catch (e) {
          this.logger.error(e);
          throw new BadRequestException(e);
        }
    
        return {
          
          tokenJSON,
          message: message,
          statuscode: statuscode
    
        };
      }

    //Generamos una contraseña aleatoria para asignarla al usuario que pidio el reseteo de su contraseña, con esta debera entrar
    //al sistema y el sistema despues del login debera pedirle cambiar su contraseña a una personalizada
    async resetPass(resetPassDto: ResetPassDto){

      //Verificamos que el correo que se ha ingresado para resetear la contraseña en verdad exista
      const externado_email = resetPassDto.externado_email;
      const externado_user = await this.externadoUsersService.findOneByEmail(externado_email);

      let message = "";
      let statuscode = 0;

      //Verificamos aca lo anterior
      if(externado_user){
        
        //Generamos una contraseña aleatoria de longitud 12
        const length = 12;
        let result = "";
        const source = "a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 + - _ *".split(" "); // Espacios para convertir cara letra a un elemento de un array

        for(let i = 0; i < length; i++){
          const random = Math.floor(Math.random() * source.length);
          result += source[random];
        }

        const salt = 12;
        const hashedPassword = await bcrypt.hash(result, salt);//Encriptamos la contraseña generada

        await this.externadoUsersService.updatePassGenerated(externado_user.idexternado_user, hashedPassword);//actualizamos la contraseña en la base de datos

        await this.emailSenderService.sendResetPassMail(externado_user.externado_email, result);//Enviamos el correo notificando el cambio de contraseña y cual es la nueva contraseña

        message= "Se ha creado una nueva contraseña y enviado a su correo electrónico. Por favor revisar su correo, incluyendo el correo spam";
        statuscode = 200;

      }else{
        throw new ForbiddenException("Usuario no existe, favor verifique correo");
      }

      return {
        message: message,
        statuscode: statuscode
      }
    }

    async setNewPass(setNewPass:SetNewPassDto, uuid: string){

      const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Verificamos que exista un usuario con ese UUID
      const externado_pass = setNewPass.externado_pass;

      let message = "";
      let statuscode = 0;
      if(externado_user){
        const salt = 12;
        const hashedPassword = await bcrypt.hash(externado_pass, salt);//Encriptamos la contraseña personalizada por el usuario
        await this.externadoUsersService.updateCustomPass(externado_user.idexternado_user, hashedPassword);//Guardamos la nueva contraseña

        message = "Se ha actualizado la contraseña exitosamente"; 
        statuscode = 200;

      }else{
        throw new ForbiddenException("Usuario no existe, favor verifique correo");
      }

      return {
        message: message,
        statuscode: statuscode
      }
    }

    //Metodo que buscara a partir del UUID del JWT, el ID del usuario correspondiente y luego el listado de responsables relacionados
    //a el
    async responsiblesPrev(uuid: string){
      
      const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
      const externado_responsible = await this.externadoResponsibleService.findByUserID(externado_user.idexternado_user);//Buscamos todos los Responsables relacionados a dicho usuario

      return externado_responsible;
    }

    //Metodo que buscara a partir del UUID del JWT, el ID del usuario correspondiente y luego el responsable relacionado a el
    async responsible(uuid: string, responsiblesDto: ResponsibleDto){
      
      const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
      const externado_responsible = await this.externadoResponsibleService.findByResponsibleID(externado_user.idexternado_user, responsiblesDto.idexternado_responsible);//Buscamos el Responsable especifico relacionado a dicho usuario

      if(!externado_responsible){
        throw new NotFoundException("No se ha encontrado información");
      }

      return externado_responsible;
    }

    //Metodo que buscara a partir del UUID del JWT, el ID del usuario correspondiente y luego el responsable relacionado a el
    //que el de arriba pero para usarlo con metodo GET
    async responsibleGet(uuid: string, id: number){
      
      const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
      const externado_responsible = await this.externadoResponsibleService.findByResponsibleID(externado_user.idexternado_user, id);//Buscamos el Responsable especifico relacionado a dicho usuario

      if(!externado_responsible){
        throw new NotFoundException("No se ha encontrado información");
      }

      return externado_responsible;
    }

    //Metodo que buscara a partir del UUID del JWT, el ID del usuario correspondiente y luego el listado de estudiantes relacionados
    //a el
    async studentsPrev(uuid: string){
      
      const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
      const externado_student = await this.externadoStudentService.findByUserID(externado_user.idexternado_user);//Buscamos todos los Estudiantes relacionados a dicho usuario

      return externado_student;
    }

    //Metodo que buscara a partir del UUID del JWT, el ID del usuario correspondiente y luego el estudiantes relacionado a el
    async student(uuid: string, studentDto: StudentDto){
      
      const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
      const externado_student = await this.externadoStudentService.findByStudentID(externado_user.idexternado_user, studentDto.idexternado_student);//Buscamos el estudiante especifico relacionado a dicho usuario

      if(!externado_student){
        throw new NotFoundException("No se ha encontrado información");
      }

      return externado_student;
    }

    //Metodo que buscara a partir del UUID del JWT, el ID del usuario correspondiente y luego el estudiantes relacionado a el. Es igual
    //que el de arriba pero para usarlo con metodo GET
    async studentGet(uuid: string, id: number){
      
      const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID
      const externado_student = await this.externadoStudentService.findByStudentID(externado_user.idexternado_user, id);//Buscamos el estudiante especifico relacionado a dicho usuario

      if(!externado_student){
        throw new NotFoundException("No se ha encontrado información");
      }

      return externado_student;
    }

    //Dada la posible carga masiva de datos, se ha creado este metodo para la aplicacion de encriptacion y formato UUID de ciertos datos
    //Se encriptara la contraseña y se creara el UUID de la manera que la aplicacion misma maneja
    //Este metodo solo puede ejecutarlo el Super Admin, se espera realizar esto antes de la puesta en vivo de la aplicacion
    async masiveEncriptUser(encriptDto: EncriptDto, uuid: string){
      
      const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID

      if(externado_user){
        if(externado_user.externado_user_type_id = 1){
          const valMin = encriptDto.minValue;
          const valMax = encriptDto.maxValue;

          for(let i = valMin; i <= valMax; i++){

            const externado_user = await this.externadoUsersService.findOneById(i);
            //const salt = 12;
            //externado_user.externado_pass = await bcrypt.hash(externado_user.externado_pass, salt);//Se ha decidido que 
            //los usuarios creados de forma masiva tendra la misma contraseña, por lo tanto en los insert ya irá la contraseña incriptada para ahorrar procesamiento

            const namespace = process.env.UUID_GENERATOR;
            const uuid = uuidv5(externado_user.externado_uuid, namespace);//Creamos un UUID a partir del correo plano ingresado en el campo externado_uuid

            externado_user.externado_uuid = uuid;//Creamos el UUID

            await this.externadoUsersService.updateUserEncript(i, externado_user);

          }
        }
      }

      return externado_user;
    }

    //Dada la posible carga masiva de datos, se ha creado este metodo para la aplicacion de encriptacion de ciertos datos
    //Se encriptaran la direccion del estudiante, telefono, email, datos de hermanos de la manera que la aplicacion misma maneja
    //Este metodo solo puede ejecutarlo el Super Admin, se espera realizar esto antes de la puesta en vivo de la aplicacion
    async masiveEncriptStudent(encriptDto: EncriptDto, uuid: string){
      
      const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID

      if(externado_user){
        if(externado_user.externado_user_type_id = 1){
          const valMin = encriptDto.minValue;
          const valMax = encriptDto.maxValue;
          const salt = 12;

          for(let i = valMin; i <= valMax; i++){

            const externado_student = await this.externadoStudentService.findByStudentIDEncript(i);
            externado_student.externado_student_address = await bcrypt.hash(externado_student.externado_student_address, salt);//Encriptamos
            externado_student.externado_student_phone = await bcrypt.hash(externado_student.externado_student_phone, salt);//Encriptamos
            externado_student.externado_student_email = await bcrypt.hash(externado_student.externado_student_email, salt);//Encriptamos
            externado_student.externado_student_siblings = await bcrypt.hash(externado_student.externado_student_address, salt);//Encriptamos

            await this.externadoStudentService.updateStudentEncript(i, externado_student);

          }
        }
      }

      return externado_user;
    }

    //Dada la posible carga masiva de datos, se ha creado este metodo para la aplicacion de encriptacion de ciertos datos
    //Se encriptaran la direccion del responsable, telefono de trabajo de la manera que la aplicacion misma maneja
    //Este metodo solo puede ejecutarlo el Super Admin, se espera realizar esto antes de la puesta en vivo de la aplicacion
    async masiveEncriptResponsible(encriptDto: EncriptDto, uuid: string){
      
      const externado_user = await this.externadoUsersService.findOneByUUID(uuid);//Buscamos el externado_user_id de dicho UUID

      if(externado_user){
        if(externado_user.externado_user_type_id = 1){
          const valMin = encriptDto.minValue;
          const valMax = encriptDto.maxValue;
          const salt = 12;

          for(let i = valMin; i <= valMax; i++){

            const externado_responsible = await this.externadoResponsibleService.findByResponsibleIDEncript(i);
            externado_responsible.externado_address = await bcrypt.hash(externado_responsible.externado_address, salt);//Encriptamos
            externado_responsible.externado_work_phone = await bcrypt.hash(externado_responsible.externado_work_phone, salt);//Encriptamos

            await this.externadoResponsibleService.updateResponsibleEncript(i, externado_responsible);

          }
        }
      }

      return externado_user;
    }
}