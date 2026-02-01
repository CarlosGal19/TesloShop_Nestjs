import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles.interface';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { UserRole } from './user-role.decorator';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    UserRole(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
