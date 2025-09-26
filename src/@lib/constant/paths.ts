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
    pos: '/admin/pos',
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
      products: {
        root: '/admin/inventory/products',
        list: '/admin/inventory/products/list',
      },
      dosageForms: {
        root: '/admin/inventory/dosage-forms',
        list: '/admin/inventory/dosage-forms/list',
      },
      generics: {
        root: '/admin/inventory/generics',
        list: '/admin/inventory/generics/list',
      },
      suppliers: {
        root: '/admin/inventory/suppliers',
        list: '/admin/inventory/suppliers/list',
      },
    },
    settings: {
      root: '/admin/settings',
    },
  },
};
