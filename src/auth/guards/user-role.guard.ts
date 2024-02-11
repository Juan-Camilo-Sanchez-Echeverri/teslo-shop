import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES_KEY } from '../decorators';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.getAllAndOverride<string[]>(
      META_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!validRoles) return true;

    if (validRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();

    const user = request.user as User;

    if (user.roles.some((role): boolean => validRoles.includes(role)))
      return true;

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role: [${validRoles}]`,
    );
  }
}
