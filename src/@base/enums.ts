export enum ENUM_SORT_ORDER_TYPE {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type TSortOrderType = keyof typeof ENUM_SORT_ORDER_TYPE;

export enum ENUM_BLOOD_GROUP_TYPE {
  'A+' = 'A+',
  'A-' = 'A-',
  'B+' = 'B+',
  'B-' = 'B-',
  'AB+' = 'AB+',
  'AB-' = 'AB-',
  'O+' = 'O+',
  'O-' = 'O-',
}

export type TBloodGroupType = keyof typeof ENUM_BLOOD_GROUP_TYPE;
