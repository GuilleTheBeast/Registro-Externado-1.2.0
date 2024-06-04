import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { ExternadoLevelsService } from './externado_levels.service';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enum/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ExternadoStudentPeriodService } from 'src/externado_student_period/externado_student_period.service';

interface RequestWithUuid extends Request{
  uuid:{
      uuid: string; rol: boolean
  }
}
@Controller('externado-levels')
export class ExternadoLevelsController {
  constructor(private readonly externadoLevelsService: ExternadoLevelsService,
             ) {}

  @Get("getLevels")
  @Roles(Role.All)
  @UseGuards(AuthGuard, RolesGuard)
  getDepartments(@Req() req: RequestWithUuid){
      return this.externadoLevelsService.getLevels(req.uuid.uuid);
  }


}
