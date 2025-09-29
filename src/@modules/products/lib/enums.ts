export enum ENUM_PRODUCT_TYPES {
  GENERAL = 'GENERAL',
  MEDICINE = 'MEDICINE',
}

export type TProductType = `${ENUM_PRODUCT_TYPES}`;
export const productTypes: TProductType[] = Object.values(ENUM_PRODUCT_TYPES);

export enum ENUM_PRODUCT_MEDICINE_TYPES {
  ALLOPATHIC = 'ALLOPATHIC',
}

export type TProductMedicineType = `${ENUM_PRODUCT_MEDICINE_TYPES}`;
export const productMedicineTypes: TProductMedicineType[] = Object.values(ENUM_PRODUCT_MEDICINE_TYPES);

export enum ENUM_PRODUCT_DURABILITY_TYPES {
  PERISHABLE = 'PERISHABLE',
  NON_PERISHABLE = 'NON_PERISHABLE',
}

export type TProductDurabilityType = `${ENUM_PRODUCT_DURABILITY_TYPES}`;
export const productDurabilityTypes: TProductDurabilityType[] = Object.values(ENUM_PRODUCT_DURABILITY_TYPES);

export enum ENUM_PRODUCT_SIZE_TYPES {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export type TProductSizeType = `${ENUM_PRODUCT_SIZE_TYPES}`;
export const productSizeTypes: TProductSizeType[] = Object.values(ENUM_PRODUCT_SIZE_TYPES);
