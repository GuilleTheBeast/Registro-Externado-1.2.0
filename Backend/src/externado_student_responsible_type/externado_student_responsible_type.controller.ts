import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ExternadoStudentResponsibleTypeService } from './externado_student_responsible_type.service';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enum/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

interface RequestWithUuid extends Request{
  uuid:{
      uuid: string; rol: boolean
  }
}
@Controller('externado-student-responsible-type')
export class ExternadoStudentResponsibleTypeController {
  constructor(private readonly externadoStudentResponsibleTypeService: ExternadoStudentResponsibleTypeService) {}

  @Get("getStudentRespType")
  @Roles(Role.All)
  @UseGuards(AuthGuard, RolesGuard)
  getStudentRespType(@Req() req: RequestWithUuid){
      return this.externadoStudentResponsibleTypeService.getStudentRespType(req.uuid.uuid);
  }
  
}
