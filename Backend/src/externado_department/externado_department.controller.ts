import { Controller, Get } from '@nestjs/common';
import { ExternadoDepartmentService } from './externado_department.service';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/enum/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Req } from '@nestjs/common';

interface RequestWithUuid extends Request{
  uuid:{
      uuid: string; rol: boolean
  }
}
@Controller('externado-department')
export class ExternadoDepartmentController {
  constructor(private readonly externadoDepartmentService: ExternadoDepartmentService) {}

  @Get("getDepartments")
  @Roles(Role.All)
  @UseGuards(AuthGuard, RolesGuard)
  getDepartments(@Req() req: RequestWithUuid){
      return this.externadoDepartmentService.getDepartments(req.uuid.uuid);
  }

}
