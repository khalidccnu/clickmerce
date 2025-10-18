export type TPermission = (typeof Permissions)[keyof typeof Permissions];

export const Permissions = {
  FORBIDDEN: 'FORBIDDEN',

  POS_READ: 'pos:read',
  POS_WRITE: 'pos:write',

  DASHBOARD_ADVANCE_READ: 'dashboard-advance:read',

  SETTINGS_READ: 'settings:read',

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

  PRODUCTS_READ: 'products:read',
  PRODUCTS_WRITE: 'products:write',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',

  CATEGORIES_READ: 'categories:read',
  CATEGORIES_WRITE: 'categories:write',
  CATEGORIES_UPDATE: 'categories:update',
  CATEGORIES_DELETE: 'categories:delete',

  DOSAGE_FORMS_READ: 'dosage_forms:read',
  DOSAGE_FORMS_WRITE: 'dosage_forms:write',
  DOSAGE_FORMS_UPDATE: 'dosage_forms:update',
  DOSAGE_FORMS_DELETE: 'dosage_forms:delete',

  GENERICS_READ: 'generics:read',
  GENERICS_WRITE: 'generics:write',
  GENERICS_UPDATE: 'generics:update',
  GENERICS_DELETE: 'generics:delete',

  SUPPLIERS_READ: 'suppliers:read',
  SUPPLIERS_WRITE: 'suppliers:write',
  SUPPLIERS_UPDATE: 'suppliers:update',
  SUPPLIERS_DELETE: 'suppliers:delete',

  ORDERS_READ: 'orders:read',
  ORDERS_WRITE: 'orders:write',
  ORDERS_UPDATE: 'orders:update',
  ORDERS_DELETE: 'orders:delete',

  ORDER_RETURNS_READ: 'order_returns:read',
  ORDER_RETURNS_WRITE: 'order_returns:write',
  ORDER_RETURNS_UPDATE: 'order_returns:update',
  ORDER_RETURNS_DELETE: 'order_returns:delete',

  DELIVERY_SERVICE_TYPES_READ: 'delivery_service_types:read',
  DELIVERY_SERVICE_TYPES_WRITE: 'delivery_service_types:write',
  DELIVERY_SERVICE_TYPES_UPDATE: 'delivery_service_types:update',
  DELIVERY_SERVICE_TYPES_DELETE: 'delivery_service_types:delete',

  DELIVERY_ZONES_READ: 'delivery_zones:read',
  DELIVERY_ZONES_WRITE: 'delivery_zones:write',
  DELIVERY_ZONES_UPDATE: 'delivery_zones:update',
  DELIVERY_ZONES_DELETE: 'delivery_zones:delete',

  COUPONS_READ: 'coupons:read',
  COUPONS_WRITE: 'coupons:write',
  COUPONS_UPDATE: 'coupons:update',
  COUPONS_DELETE: 'coupons:delete',

  PAYMENT_METHODS_READ: 'payment_methods:read',
  PAYMENT_METHODS_WRITE: 'payment_methods:write',
  PAYMENT_METHODS_UPDATE: 'payment_methods:update',
  PAYMENT_METHODS_DELETE: 'payment_methods:delete',
} as const;
