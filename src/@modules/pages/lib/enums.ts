export enum ENUM_PAGE_TYPES {
  ABOUT = 'ABOUT',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  TERMS_AND_CONDITIONS = 'TERMS_AND_CONDITIONS',
  REFUND_POLICY = 'REFUND_POLICY',
}

export type TPageType = `${ENUM_PAGE_TYPES}`;
export const pageTypes: TPageType[] = Object.values(ENUM_PAGE_TYPES);
