export enum ENUM_PRODUCTS_TYPES {
  GENERAL = 'GENERAL',
  MEDICINE = 'MEDICINE',
}

export type TProductsType = `${ENUM_PRODUCTS_TYPES}`;
export const productsTypes: TProductsType[] = Object.values(ENUM_PRODUCTS_TYPES);

export enum ENUM_PRODUCTS_MEDICINES_TYPES {
  ALLOPATHIC = 'ALLOPATHIC',
}

export type TProductsMedicinesType = `${ENUM_PRODUCTS_MEDICINES_TYPES}`;
export const productsMedicinesTypes: TProductsMedicinesType[] = Object.values(ENUM_PRODUCTS_MEDICINES_TYPES);

export enum ENUM_PRODUCTS_DURABILITIES {
  PERISHABLE = 'PERISHABLE',
  NON_PERISHABLE = 'NON_PERISHABLE',
}

export type TProductsDurability = `${ENUM_PRODUCTS_DURABILITIES}`;
export const productsDurabilities: TProductsDurability[] = Object.values(ENUM_PRODUCTS_DURABILITIES);
