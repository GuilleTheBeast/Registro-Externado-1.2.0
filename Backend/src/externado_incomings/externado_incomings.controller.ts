import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ExternadoIncomingsService } from './externado_incomings.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enum/roles.enum';

interface RequestWithUuid extends Request{
  uuid:{
      uuid: string; rol: boolean
  }
}

@Controller('externado-incomings')
export class ExternadoIncomingsController {
  constructor(private readonly externadoIncomingsService: ExternadoIncomingsService) {}

  @Get("getIncomings")
  @Roles(Role.All)
  @UseGuards(AuthGuard, RolesGuard)
  getIncomings(@Req() req: RequestWithUuid){
      return this.externadoIncomingsService.getIncomings(req.uuid.uuid);
  }

}
