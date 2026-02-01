import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles.interface';

export const META_ROLES = 'roles';

export const UserRole = (...args: ValidRoles[]) =>
  SetMetadata(META_ROLES, args);
