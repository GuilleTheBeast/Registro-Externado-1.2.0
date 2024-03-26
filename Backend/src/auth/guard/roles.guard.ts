import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate { 
  constructor(
    private readonly reflector: Reflector
    )
  {}

  canActivate( context: ExecutionContext, ): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if(!requiredRoles){
      return false;
    }

    const { uuid } = context.switchToHttp().getRequest();

    let valorExiste = requiredRoles.includes(uuid.rol);

    if(requiredRoles[0] === "all" && (uuid.rol === 1 || uuid.rol === 2 || uuid.rol === 3)){
      valorExiste = true;
    }

    if(requiredRoles[0] === "allA" && (uuid.rol === 1 || uuid.rol === 2)){
      valorExiste = true;
    }

    return valorExiste;
  }
}
