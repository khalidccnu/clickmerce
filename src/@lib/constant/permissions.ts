export type TPermission = (typeof Permissions)[keyof typeof Permissions];

export const Permissions = {
  FORBIDDEN: 'FORBIDDEN',

  DASHBOARD_ADVANCE_READ: 'dashboard-advance:read',

  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  PERMISSION_TYPES_READ: 'permission_types:read',
  PERMISSION_TYPES_WRITE: 'permission_types:write',
  PERMISSION_TYPES_UPDATE: 'permission_types:update',
  PERMISSION_TYPES_DELETE: 'permission_types:delete',

  PERMISSIONS_READ: 'permissions:read',
  PERMISSIONS_WRITE: 'permissions:write',
  PERMISSIONS_UPDATE: 'permissions:update',
  PERMISSIONS_DELETE: 'permissions:delete',

  ROLES_READ: 'roles:read',
  ROLES_WRITE: 'roles:write',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',
} as const;
