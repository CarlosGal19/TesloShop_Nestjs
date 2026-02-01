enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

export interface IJwtPayload {
  user: {
    user_id: string;
    name: string;
    lastName: string;
    email: string;
    roles: Role[];
  };
}
