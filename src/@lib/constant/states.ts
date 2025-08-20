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
    initialValue: ENUM_THEME_TYPES.SYSTEM,
  },
  headerHeight: {
    key: 'headerHeight',
    initialValue: 0,
  },
  menu: {
    key: 'menu',
    initialValue: {
      openMenuKeys: [],
    },
  },
};
