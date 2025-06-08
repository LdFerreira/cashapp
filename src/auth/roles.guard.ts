import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Request } from 'express';
interface Role {
  name: string;
}

interface AuthUser {
  id: string;
  email: string;
  role: Role;
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndMerge<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Rota não exige papel específico
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthUser;
    if (!user?.role?.name || !requiredRoles.includes(user.role.name)) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta rota',
      );
    }

    return true;
  }
}
