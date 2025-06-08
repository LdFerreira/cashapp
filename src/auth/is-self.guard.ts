import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SELF_PARAM_KEY } from './is-self.decorator';
import { Request } from 'express';
interface AuthUser {
  id: string;
  email: string;
}
@Injectable()
export class IsSelfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const paramKey = this.reflector.get<string>(
      SELF_PARAM_KEY,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthUser;

    const routeParam = request.params[paramKey || 'id'];

    if (!user?.id || routeParam !== user.id) {
      throw new ForbiddenException('You can only access your own user data');
    }

    return true;
  }
}
