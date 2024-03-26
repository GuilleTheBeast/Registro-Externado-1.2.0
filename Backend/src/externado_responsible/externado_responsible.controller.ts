import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ExternadoResponsibleService } from './externado_responsible.service';
import { UpdateExternadoResponsibleDto } from './dto/update-externado_responsible.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enum/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

interface RequestWithUuid extends Request{
  uuid:{
      uuid: string; rol: boolean
  }
}
@Controller('externado-responsible')
export class ExternadoResponsibleController {
  constructor(private readonly externadoResponsibleService: ExternadoResponsibleService) {}

  @Post("registerResponsible")
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  registerResponsible(@Req() req: RequestWithUuid, @Body() updateExternadoResponsibleDto: UpdateExternadoResponsibleDto){
      return this.externadoResponsibleService.createResponsible(req.uuid.uuid, updateExternadoResponsibleDto);
  }

  @Post("updateResponsible")
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  updateResponsible(@Req() req: RequestWithUuid, @Body() updateExternadoResponsibleDto: UpdateExternadoResponsibleDto){
      return this.externadoResponsibleService.updateResponsible(req.uuid.uuid, updateExternadoResponsibleDto);
  }

  @Post("deleteResponsible")
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  deleteResponsible(@Req() req: RequestWithUuid, @Body() updateExternadoResponsibleDto: UpdateExternadoResponsibleDto){
      return this.externadoResponsibleService.deleteResponsible(req.uuid.uuid, updateExternadoResponsibleDto);
  }

  @Post("pdfResponsibles")
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  pdfResponsibles(@Req() req: RequestWithUuid){
      return this.externadoResponsibleService.pdfResponsibles(req.uuid.uuid);
  }
}
