import { IBaseEntity, IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { IDosageForm } from '@modules/dosage-forms/lib/interfaces';
import { IGeneric } from '@modules/generics/lib/interfaces';
import { ISupplier } from '@modules/suppliers/lib/interfaces';
import { TProductsDurability, TProductsMedicinesType, TProductsType } from './enums';

export interface IProductsFilter extends IBaseFilter {
  type?: TProductsType;
  dosage_form_id?: TId;
  generic_id?: TId;
  supplier_id?: TId;
}

export interface IProductImage {
  url: string;
  is_featured: boolean;
}

export interface IProductVariation {
  cost_price: number;
  sale_price: number;
  quantity: number;
  mfg: string;
  exp: string;
}

export interface IProduct extends IBaseEntity {
  type: TProductsType;
  images: IProductImage[];
  name: string;
  slug: string;
  strength: string;
  medicine_type: TProductsMedicinesType;
  rack: string;
  quantity: number;
  dosage_form: IDosageForm;
  generic: IGeneric;
  supplier: ISupplier;
  durability: TProductsDurability;
  variations: (IProductVariation & IBaseEntity)[];
}

export interface IProductsResponse extends IBaseResponse {
  data: IProduct[];
}

export interface IProductCreate {
  type: TProductsType;
  images: IProductImage[];
  name: string;
  slug: string;
  strength: string;
  medicine_type: TProductsMedicinesType;
  rack: string;
  dosage_form_id: TId;
  generic_id: TId;
  supplier_id: TId;
  durability: TProductsDurability;
  variations: (IProductVariation & { id?: TId; is_deleted?: boolean })[];
  is_active: string;
}
