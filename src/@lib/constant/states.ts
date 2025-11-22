import { ENUM_THEME_TYPES } from '@lib/enums/theme.enum';

interface IStates {
  [name: string]: {
    key: string;
    initialValue: any;
  };
}

export const States: IStates = {
  theme: {
    key: 'theme',
    initialValue: ENUM_THEME_TYPES.LIGHT,
  },
  landingHeaderScrollingDown: {
    key: 'landingHeaderScrollingDown',
    initialValue: false,
  },
  landingHeaderHeight: {
    key: 'landingHeaderHeight',
    initialValue: 0,
  },
  adminHeaderHeight: {
    key: 'adminHeaderHeight',
    initialValue: 0,
  },
  sidebar: {
    key: 'sidebar',
    initialValue: {
      isCollapsed: false,
    },
  },
  menu: {
    key: 'menu',
    initialValue: {
      openMenuKeys: [],
    },
  },
  order: {
    key: 'order',
    initialValue: {
      wishlist: [],
      cart: [],
    },
  },
};
