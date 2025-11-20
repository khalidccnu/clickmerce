import { IBaseEntity, IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { IDeliveryZone } from '@modules/delivery-zones/lib/interfaces';
import { IPaymentMethod } from '@modules/payment-methods/lib/interfaces';
import { IProduct, IProductVariation } from '@modules/products/lib/interfaces';
import { IUser } from '@modules/users/lib/interfaces';
import { TOrderPaymentStatusType, TOrderStatusType } from './enums';

export interface IOrdersFilter extends IBaseFilter {
  customer_id?: TId;
  payment_method_id?: TId;
  delivery_zone_id?: TId;
  payment_status?: TOrderPaymentStatusType;
  status?: TOrderStatusType;
}

export interface IOrder extends IBaseEntity {
  code: TId;
  customer_id: TId;
  customer: IUser;
  products: {
    id: TId;
    variations: (IProductVariation & { id: TId; sale_discount_price: number })[];
    current_info: IProduct;
  }[];
  redeem_amount: number;
  vat_amount: number;
  tax_amount: number;
  delivery_charge: number;
  pay_amount: number;
  due_amount: number;
  sub_total_amount: number;
  grand_total_amount: number;
  round_off_amount: number;
  payment_method: IPaymentMethod;
  delivery_zone: IDeliveryZone;
  payment_reference: string;
  payment_status: TOrderPaymentStatusType;
  status: TOrderStatusType;
}

export interface IOrdersResponse extends IBaseResponse {
  data: IOrder[];
}

export interface IOrderCreate {
  code: TId;
  products: {
    id: TId;
    variation_id: TId;
    selected_quantity: number;
    discount: IProductVariation['discount'];
  }[];
  redeem_amount: number;
  pay_amount: number;
  payment_method_id: TId;
  delivery_zone_id: TId;
  customer_id: TId;
  coupon_id: TId;
  status: TOrderStatusType;
  is_round_off: boolean;
  is_draft?: boolean;
}

export interface IOrderQuickCreate {
  name: string;
  phone: string;
  email: string;
  products: {
    id: TId;
    variation_id: TId;
    selected_quantity: number;
  }[];
  payment_method_id: TId;
  delivery_zone_id: TId;
  coupon: TId;
}

export interface IOrderReturnUpdate {
  redeem_amount: number;
  products: {
    id: TId;
    variations: {
      id: TId;
      return_quantity: number;
    }[];
  }[];
}
