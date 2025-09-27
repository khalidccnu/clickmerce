import { IBaseEntity, IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { TCouponType } from './enums';

export interface ICouponsFilter extends IBaseFilter {}

export interface ICoupon extends IBaseEntity {
  code: TId;
  type: TCouponType;
  amount: number;
  valid_from: string;
  valid_until: string;
  min_purchase_amount: number;
  max_redeemable_amount: number;
  usage_count: number;
  usage_limit: number;
}

export interface ICouponsResponse extends IBaseResponse {
  data: ICoupon[];
}

export interface ICouponCreate {
  code: TId;
  type: TCouponType;
  amount: number;
  valid_from: string;
  valid_until: string;
  min_purchase_amount: number;
  max_redeemable_amount: number;
  usage_limit: number;
  is_active: string;
}
