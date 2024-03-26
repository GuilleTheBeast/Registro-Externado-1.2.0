import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ExternadoResponsibleTypeService } from './externado_responsible_type.service';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enum/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

interface RequestWithUuid extends Request{
  uuid:{
      uuid: string; rol: boolean
  }
}
@Controller('externado-responsible-type')
export class ExternadoResponsibleTypeController {
  constructor(private readonly externadoResponsibleTypeService: ExternadoResponsibleTypeService) {}

  @Get("getResponsibleTypes")
  @Roles(Role.All)
  @UseGuards(AuthGuard, RolesGuard)
  getResponsibleTypes(@Req() req: RequestWithUuid){
      return this.externadoResponsibleTypeService.getResponsibleTypes(req.uuid.uuid);
  }

  @Get("getResponsibleTypesLeft")
  @Roles(Role.All)
  @UseGuards(AuthGuard, RolesGuard)
  getResponsibleTypesLeft(@Req() req: RequestWithUuid){
      return this.externadoResponsibleTypeService.getResponsibleTypesLeftJoin(req.uuid.uuid);
  }
  
}
