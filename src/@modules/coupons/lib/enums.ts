export enum ENUM_COUPON_TYPES {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

export type TCouponType = `${ENUM_COUPON_TYPES}`;
export const couponTypes: TCouponType[] = Object.values(ENUM_COUPON_TYPES);
