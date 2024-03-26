import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ExternadoPepService } from './externado_pep.service';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enum/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

interface RequestWithUuid extends Request{
  uuid:{
      uuid: string; rol: boolean
  }
}

@Controller('externado-pep')
export class ExternadoPepController {
  constructor(private readonly externadoPepService: ExternadoPepService) {}

  @Get("getPep")
  @Roles(Role.All)
  @UseGuards(AuthGuard, RolesGuard)
  getPep(@Req() req: RequestWithUuid){
      return this.externadoPepService.getPep(req.uuid.uuid);
  }
  
}
