import { IBaseEntity, IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { IDosageForm } from '@modules/dosage-forms/lib/interfaces';
import { IGeneric } from '@modules/generics/lib/interfaces';
import { ISupplier } from '@modules/suppliers/lib/interfaces';
import {
  TProductDiscountType,
  TProductDurabilityType,
  TProductMedicineType,
  TProductSizeType,
  TProductType,
} from './enums';

export interface IProductsFilter extends IBaseFilter {
  type?: TProductType;
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
  mfg: string;
  exp: string;
  color: string;
  size: TProductSizeType;
  discount: {
    type: TProductDiscountType;
    amount: number;
  };
  quantity: number;
}

export interface IProduct extends IBaseEntity {
  type: TProductType;
  images: IProductImage[];
  name: string;
  slug: string;
  specification: string;
  medicine_type: TProductMedicineType;
  rack: string;
  quantity: number;
  dosage_form: IDosageForm;
  generic: IGeneric;
  supplier: ISupplier;
  durability: TProductDurabilityType;
  variations: (IProductVariation & IBaseEntity)[];
  description: string;
}

export interface IProductsResponse extends IBaseResponse {
  data: IProduct[];
}

export interface IProductCreate {
  type: TProductType;
  images: IProductImage[];
  name: string;
  slug: string;
  specification: string;
  medicine_type: TProductMedicineType;
  rack: string;
  dosage_form_id: TId;
  generic_id: TId;
  supplier_id: TId;
  durability: TProductDurabilityType;
  variations: Partial<IProductVariation & { id?: TId; is_deleted?: boolean }>[];
  description: string;
  is_active: string;
}
