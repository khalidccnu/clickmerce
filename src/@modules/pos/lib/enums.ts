export enum ENUM_POS_DISCOUNT_TYPES {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

export type TPosDiscountType = `${ENUM_POS_DISCOUNT_TYPES}`;
export const posDiscountTypes: TPosDiscountType[] = Object.values(ENUM_POS_DISCOUNT_TYPES);
