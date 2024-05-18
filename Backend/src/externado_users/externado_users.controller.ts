import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ExternadoUsersService } from './externado_users.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/auth/enum/roles.enum';
import { Roles } from 'src/auth/decorators/roles.decorators';

interface RequestWithUuid extends Request{
  uuid:{
      uuid: string; rol: boolean
  }
}
@Controller('externado-users')
export class ExternadoUsersController {
  constructor(
    private readonly externadoUsersService: ExternadoUsersService) {}

    @Get("activateEmail/:c")
    activeEmail(@Param('c') uuid: string) {
        return this.externadoUsersService.activeEmail(uuid);
    }

    @Get("allUsersSuper")
    @Roles(Role.Super)
    @UseGuards(AuthGuard, RolesGuard)
    allUsersSuper(@Req() req: RequestWithUuid){
        return this.externadoUsersService.userSuperGet(req.uuid.uuid);
    }

    @Get("allUsersAdm")
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    allUsersAdm(@Req() req: RequestWithUuid){
        return this.externadoUsersService.userAdminGet(req.uuid.uuid);
    }

    @Get("allUsersAssistant")
    @Roles(Role.Assistant)
    @UseGuards(AuthGuard, RolesGuard)
    allUsersAssistant(@Req() req: RequestWithUuid){
        return this.externadoUsersService.userAdminGet(req.uuid.uuid);
    }

    @Get("getUserInfoSuper/:id")
    @Roles(Role.Super)
    @UseGuards(AuthGuard, RolesGuard)
    getUserInfoSuper(@Param('id') id: number, @Req() req: RequestWithUuid){
        return this.externadoUsersService.getUserInfoSuper(id, req.uuid.uuid);
    }

}
