import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ExternadoChurchsService } from './externado_churchs.service';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enum/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';

interface RequestWithUuid extends Request{
  uuid:{
      uuid: string; rol: boolean
  }
}

@Controller('externado-church')
export class ExternadoChurchsController {
  constructor(private readonly externadoChurchsService: ExternadoChurchsService) {}

  @Get("getChurches")
  @Roles(Role.All)
  @UseGuards(AuthGuard, RolesGuard)
  getChurches(@Req() req: RequestWithUuid){
      return this.externadoChurchsService.getChurch(req.uuid.uuid);
  }

}
