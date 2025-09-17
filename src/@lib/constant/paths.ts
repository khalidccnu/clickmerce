import { TId } from '@base/interfaces';

export const Paths = {
  root: '/',
  initiate: '/initiate',
  underConstruction: '/under-construction',
  auth: {
    signIn: '/auth',
  },
  admin: {
    root: '/admin',
    users: {
      root: '/admin/users',
      list: '/admin/users/list',
    },
    roleManager: {
      root: '/admin/role-manager',
      permissionTypes: {
        root: '/admin/role-manager/permission-types',
        list: '/admin/role-manager/permission-types/list',
      },
      permissions: {
        root: '/admin/role-manager/permissions',
        list: '/admin/role-manager/permissions/list',
      },
      roles: {
        root: '/admin/role-manager/roles',
        list: '/admin/role-manager/roles/list',
        toId: (id: TId) => `/admin/role-manager/roles/${id}`,
      },
    },
    inventory: {
      root: '/admin/inventory',
      suppliers: {
        root: '/admin/inventory/suppliers',
        list: '/admin/inventory/suppliers/list',
      },
    },
  },
};
