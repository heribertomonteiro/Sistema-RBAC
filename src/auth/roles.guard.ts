import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../common/enums/user-role.enum';

function expandRoleHierarchy(roles: UserRole[] | undefined | null): Set<UserRole> {
  const effectiveRoles = new Set<UserRole>();

  for (const role of roles ?? []) {
    effectiveRoles.add(role);

    if (role === UserRole.Admin) {
      effectiveRoles.add(UserRole.Moderator);
      effectiveRoles.add(UserRole.User);
    }

    if (role === UserRole.Moderator) {
      effectiveRoles.add(UserRole.User);
    }
  }

  return effectiveRoles;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    const effectiveRoles = expandRoleHierarchy(user?.roles);
    return requiredRoles.some((role) => effectiveRoles.has(role));
  }
}