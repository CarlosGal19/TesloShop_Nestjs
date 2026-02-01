import { SetMetadata } from '@nestjs/common';

export const META_ROLES = 'roles';

export const UserRole = (...args: string[]) => SetMetadata(META_ROLES, args);
