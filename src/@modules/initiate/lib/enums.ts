export enum ENUM_INITIATE_TYPE {
  MANUAL = 'MANUAL',
  RESTORE = 'RESTORE',
}

export type TInitiateType = keyof typeof ENUM_INITIATE_TYPE;
