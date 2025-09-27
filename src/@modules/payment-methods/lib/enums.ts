export enum ENUM_PAYMENT_METHOD_TYPES {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
}

export type TPaymentMethodType = `${ENUM_PAYMENT_METHOD_TYPES}`;
export const paymentMethodTypes: TPaymentMethodType[] = Object.values(ENUM_PAYMENT_METHOD_TYPES);

export enum ENUM_PAYMENT_METHOD_REFERENCE_TYPES {
  AUTO = 'AUTO',
  TRX = 'TRX',
  FILE = 'FILE',
}

export type TPaymentMethodReferenceType = `${ENUM_PAYMENT_METHOD_REFERENCE_TYPES}`;
export const paymentMethodReferenceTypes: TPaymentMethodReferenceType[] = Object.values(
  ENUM_PAYMENT_METHOD_REFERENCE_TYPES,
);
