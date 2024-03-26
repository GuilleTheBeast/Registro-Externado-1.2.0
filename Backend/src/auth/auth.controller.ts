import { Body, Controller, Get, Post, UseGuards, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { Request } from 'express';
import { Roles } from './decorators/roles.decorators';
import { RolesGuard } from './guard/roles.guard';
import { Role } from './enum/roles.enum';
import { StudentDto } from './dto/student.dto';
import { ResponsibleDto } from './dto/responsible.dto';
import { ResetPassDto } from './dto/resetPass.dto';
import { SetNewPassDto } from './dto/setNewPass.dto';
import { EncriptDto } from './dto/encript.dto';

interface RequestWithUuid extends Request{
    uuid:{
        uuid: string; rol: boolean
    }
}

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ){}

    @Post("register")
    createUser(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post("login")
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post("resetPass")
    resetPass(@Body() resetPassDto: ResetPassDto) {
        return this.authService.resetPass(resetPassDto);
    }

    @Post("setNewPass")
    @Roles(Role.All)
    @UseGuards(AuthGuard, RolesGuard)
    setNewPass(@Body() setNewPassDto: SetNewPassDto, @Req() req: RequestWithUuid){
        return this.authService.setNewPass(setNewPassDto, req.uuid.uuid);
    }

    @Get("responsiblesPrev")
    @Roles(Role.All)
    @UseGuards(AuthGuard, RolesGuard)
    responsiblesPrev(@Req() req: RequestWithUuid){
        return this.authService.responsiblesPrev(req.uuid.uuid);
    }

    @Post("responsible")
    @Roles(Role.All)
    @UseGuards(AuthGuard, RolesGuard)
    responsible(@Req() req: RequestWithUuid, @Body() responsibleDto: ResponsibleDto){
        return this.authService.responsible(req.uuid.uuid, responsibleDto);
    }

    @Get("responsibleGet/:id")
    @Roles(Role.All)
    @UseGuards(AuthGuard, RolesGuard)
    responsibleGet(@Req() req: RequestWithUuid, @Param('id') id: number){
        return this.authService.responsibleGet(req.uuid.uuid, id);
    }

    @Get("studentsPrev")
    @Roles(Role.All)
    @UseGuards(AuthGuard, RolesGuard)
    studentPrevs(@Req() req: RequestWithUuid){
        return this.authService.studentsPrev(req.uuid.uuid);
    }

    @Post("student")
    @Roles(Role.All)
    @UseGuards(AuthGuard, RolesGuard)
    student(@Req() req: RequestWithUuid, @Body() studentDto: StudentDto){
        return this.authService.student(req.uuid.uuid, studentDto);
    }

    @Get("studentGet/:id")
    @Roles(Role.All)
    @UseGuards(AuthGuard, RolesGuard)
    studentGet(@Req() req: RequestWithUuid, @Param('id') id: number){
        return this.authService.studentGet(req.uuid.uuid, id);
    }

    @Post("masiveEncriptUser")
    @Roles(Role.Super)
    @UseGuards(AuthGuard, RolesGuard)
    masiveEncriptUser(@Body() encriptDto: EncriptDto, @Req() req: RequestWithUuid){
        return this.authService.masiveEncriptUser(encriptDto, req.uuid.uuid);
    }

    @Post("masiveEncriptStudent")
    @Roles(Role.Super)
    @UseGuards(AuthGuard, RolesGuard)
    masiveEncriptStudent(@Body() encriptDto: EncriptDto, @Req() req: RequestWithUuid){
        return this.authService.masiveEncriptStudent(encriptDto, req.uuid.uuid);
    }

    @Post("masiveEncriptResponsible")
    @Roles(Role.Super)
    @UseGuards(AuthGuard, RolesGuard)
    masiveEncriptResponsible(@Body() encriptDto: EncriptDto, @Req() req: RequestWithUuid){
        return this.authService.masiveEncriptResponsible(encriptDto, req.uuid.uuid);
    }

}
