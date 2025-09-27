export enum ENUM_SORT_ORDER_TYPES {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type TSortOrderType = keyof typeof ENUM_SORT_ORDER_TYPES;

export enum ENUM_BLOOD_GROUP_TYPES {
  'A+' = 'A+',
  'A-' = 'A-',
  'B+' = 'B+',
  'B-' = 'B-',
  'AB+' = 'AB+',
  'AB-' = 'AB-',
  'O+' = 'O+',
  'O-' = 'O-',
}

export type TBloodGroupType = keyof typeof ENUM_BLOOD_GROUP_TYPES;
