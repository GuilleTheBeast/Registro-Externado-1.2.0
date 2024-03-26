import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ExternadoStudentService } from './externado_student.service';
import { UpdateExternadoStudentDto } from './dto/update-externado_student.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enum/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

interface RequestWithUuid extends Request{
  uuid:{
      uuid: string; rol: boolean
  }
}
@Controller('externado-student')
export class ExternadoStudentController {
  constructor(private readonly externadoStudentService: ExternadoStudentService) {}

  @Post("registerStudent")
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  registerStudent(@Req() req: RequestWithUuid, @Body() updateExternadoStudentDto: UpdateExternadoStudentDto){
      return this.externadoStudentService.registerStudent(req.uuid.uuid, updateExternadoStudentDto);
  }

  @Post("updateStudent")
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  updateStudent(@Req() req: RequestWithUuid, @Body() updateExternadoStudentDto: UpdateExternadoStudentDto){
      return this.externadoStudentService.updateStudent(req.uuid.uuid, updateExternadoStudentDto);
  }

  @Post("deleteStudent")
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  deleteStudent(@Req() req: RequestWithUuid, @Body() updateExternadoStudentDto: UpdateExternadoStudentDto){
      return this.externadoStudentService.deleteStudent(req.uuid.uuid, updateExternadoStudentDto);
  }

  @Post("pdfStudent")
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  pdfStudent(@Req() req: RequestWithUuid, @Body() updateExternadoStudentDto: UpdateExternadoStudentDto){
      return this.externadoStudentService.pdfStudent(req.uuid.uuid, updateExternadoStudentDto);
  }

  
}
