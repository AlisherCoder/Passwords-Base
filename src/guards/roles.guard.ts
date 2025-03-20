import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private refloctor: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let roles = this.refloctor.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }
    let { user } = context.switchToHttp().getRequest();
    return roles.some((role: string) => role == user.role);
  }
}
