import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ExternadoAdminSystemService } from './externado_admin_system.service';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enum/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UpdateExternadoAdminSystemDto } from './dto/update-externado_admin_system.dto';

interface RequestWithUuid extends Request{
  uuid:{
      uuid: string; rol: boolean
  }
}

@Controller('externado-admin-system')
export class ExternadoAdminSystemController {
  constructor(private readonly externadoAdminSystemService: ExternadoAdminSystemService) {}

  @Get()
  findAll() {
    return this.externadoAdminSystemService.findAll();
  }

  @Post("createSystemConf")
  @Roles(Role.Super)
  @UseGuards(AuthGuard, RolesGuard)
  createSystemConf(@Body() updateExternadoAdminSystemDto: UpdateExternadoAdminSystemDto, @Req() req: RequestWithUuid){
      return this.externadoAdminSystemService.createSystemConf(updateExternadoAdminSystemDto, req.uuid.uuid);
  }
  
  @Get("getActualPeriod")
  @Roles(Role.Super)
  @UseGuards(AuthGuard, RolesGuard)
  getActualPeriod(@Req() req: RequestWithUuid){
      return this.externadoAdminSystemService.findOneByLastPeriod();
  }

  @Post("updateSystemConf")
  @Roles(Role.Super)
  @UseGuards(AuthGuard, RolesGuard)
  updateSystemConf(@Body() updateExternadoAdminSystemDto: UpdateExternadoAdminSystemDto, @Req() req: RequestWithUuid){
      return this.externadoAdminSystemService.updateSystemConf(updateExternadoAdminSystemDto, req.uuid.uuid);
  }

  @Get("historicalPeriod")
  @Roles(Role.Super, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  historicalPeriod(@Req() req: RequestWithUuid){
      return this.externadoAdminSystemService.historicalPeriod();
  }

  @Get("historicalPeriod2")
  historicalPeriod2(){
    return this.externadoAdminSystemService.historicalPeriod();
  }
}
