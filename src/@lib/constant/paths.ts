import { TId } from '@base/interfaces';

export const Paths = {
  root: '/',
  initiate: '/initiate',
  underConstruction: '/under-construction',
  wishlist: '/wishlist',
  cart: '/cart',
  checkout: '/checkout',
  order: {
    success: '/order/success',
    failed: '/order/failed',
    payment: '/order/payment',
  },
  products: {
    root: '/products',
    toSlug: (slug: TId) => `/${slug}`,
  },
  categories: '/categories',
  about: '/about',
  contact: '/contact',
  privacyPolicy: '/privacy-policy',
  termsAndConditions: '/terms-and-conditions',
  refundPolicy: '/refund-policy',
  auth: {
    signIn: '/auth',
  },
  user: {
    uRoot: '/user',
    editProfile: '/user/edit-profile',
    changePassword: '/user/change-password',
    orders: {
      root: '/user/orders',
      toId: (id: TId) => `/user/orders/${id}`,
    },
  },
  admin: {
    aRoot: '/admin',
    pos: '/admin/pos',
    galleries: '/admin/galleries',
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
      categories: {
        root: '/admin/inventory/categories',
        list: '/admin/inventory/categories/list',
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
    sale: {
      root: '/admin/sale',
      orders: {
        root: '/admin/sale/orders',
        list: '/admin/sale/orders/list',
      },
      orderReturns: {
        root: '/admin/sale/order-returns',
        list: '/admin/sale/order-returns/list',
      },
      orderPaymentRequests: {
        root: '/admin/sale/order-payment-requests',
        list: '/admin/sale/order-payment-requests/list',
      },
    },
    delivery: {
      root: '/admin/delivery',
      serviceTypes: {
        root: '/admin/delivery/service-types',
        list: '/admin/delivery/service-types/list',
      },
      zones: {
        root: '/admin/delivery/zones',
        list: '/admin/delivery/zones/list',
      },
    },
    coupons: {
      root: '/admin/coupons',
      list: '/admin/coupons/list',
    },
    paymentMethods: {
      root: '/admin/payment-methods',
      list: '/admin/payment-methods/list',
    },
    tallyKhata: {
      root: '/admin/tally-khata',
      dashboard: {
        root: '/admin/tally-khata/dashboard',
      },
      transactions: {
        root: '/admin/tally-khata/transactions',
        list: '/admin/tally-khata/transactions/list',
      },
    },
    cms: {
      root: '/admin/cms',
      banners: {
        root: '/admin/cms/banners',
        list: '/admin/cms/banners/list',
      },
      features: {
        root: '/admin/cms/features',
        list: '/admin/cms/features/list',
      },
      reviews: {
        root: '/admin/cms/reviews',
        list: '/admin/cms/reviews/list',
      },
      notices: {
        root: '/admin/cms/notices',
        list: '/admin/cms/notices/list',
      },
      popups: {
        root: '/admin/cms/popups',
        list: '/admin/cms/popups/list',
      },
      pages: {
        root: '/admin/cms/pages',
        list: '/admin/cms/pages/list',
      },
    },
    settings: {
      root: '/admin/settings',
    },
  },
};
