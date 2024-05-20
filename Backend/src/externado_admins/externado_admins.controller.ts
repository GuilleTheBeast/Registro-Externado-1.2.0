import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ExternadoAdminsService } from './externado_admins.service';
import { Role } from 'src/auth/enum/roles.enum';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UpdateExternadoAdminDto } from './dto/update-externado_admin.dto';
import { UpdateExternadoUserDto } from 'src/externado_users/dto/update-externado_user.dto';
import { UpdateExternadoStudentDto } from 'src/externado_student/dto/update-externado_student.dto';
import { UpdateExternadoResponsibleDto } from 'src/externado_responsible/dto/update-externado_responsible.dto';
interface RequestWithUuid extends Request{
  uuid:{
      uuid: string; rol: boolean
  }
}

@Controller('externado-admins')
export class ExternadoAdminsController {
  constructor(private readonly externadoAdminsService: ExternadoAdminsService) {}

  @Get()
  findAll() {
    return this.externadoAdminsService.findAll();
  }

  @Post("createEditAdmin")
  @Roles(Role.Super)
  @UseGuards(AuthGuard, RolesGuard)
  createEditAdmin(@Body() updateExternadoAdminDto: UpdateExternadoAdminDto, @Req() req: RequestWithUuid){
      return this.externadoAdminsService.createEditAdmin(updateExternadoAdminDto, req.uuid.uuid);
  }

  @Post("editStatusResponsible")
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  editStatusResponsible(@Body() updateExternadoUserDto: UpdateExternadoUserDto, @Req() req: RequestWithUuid){
      return this.externadoAdminsService.editStatusResponsible(updateExternadoUserDto, req.uuid.uuid);
  }

  @Get("studentList")
  @Roles(Role.AllA)
  @UseGuards(AuthGuard, RolesGuard)
    studentList(@Req() req: RequestWithUuid, @Query() query: { nombre: string,  page: number, limit: number, paginated: string }){
        return this.externadoAdminsService.studentList(req.uuid.uuid, query.nombre, query.page, query.limit, query.paginated);
    }

@Post("editStudentByAdmins")
@Roles(Role.AllA)
@UseGuards(AuthGuard, RolesGuard)
editStudentByAdmins(@Body() updateExternadoStudentDto: UpdateExternadoStudentDto, @Req() req: RequestWithUuid){
        return this.externadoAdminsService.editStudentByAdmins(updateExternadoStudentDto, req.uuid.uuid);
}

  @Get("studentGet/:id")
  @Roles(Role.AllA)
  @UseGuards(AuthGuard, RolesGuard)
  studentGet(@Req() req: RequestWithUuid, @Param('id') id: number){
      return this.externadoAdminsService.studentGet(req.uuid.uuid, id);
  }

  @Get("responsibleGet/:id")
  @Roles(Role.AllA)
  @UseGuards(AuthGuard, RolesGuard)
  responsibleGet(@Req() req: RequestWithUuid, @Param('id') id: number){
      return this.externadoAdminsService.responsibleGet(req.uuid.uuid, id);
  }

  @Post("responsiblesByStudent")
  @Roles(Role.AllA)
  @UseGuards(AuthGuard, RolesGuard)
  responsiblesByStudent(@Body() updateExternadoResponsibleDto: UpdateExternadoResponsibleDto, @Req() req: RequestWithUuid){
      return this.externadoAdminsService.responsiblesByStudent(updateExternadoResponsibleDto, req.uuid.uuid);
  }

}
