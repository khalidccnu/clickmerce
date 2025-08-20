export type TRole = (typeof Roles)[keyof typeof Roles];

export const Roles = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  CUSTOMER: 'Customer',
} as const;
