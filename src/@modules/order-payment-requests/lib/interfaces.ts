import { IBaseEntity, IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { IOrder } from '@modules/orders/lib/interfaces';

export interface IOrderPaymentRequestsFilter extends IBaseFilter {
  customer_id?: TId;
  order_id?: TId;
}

export interface IOrderPaymentRequest extends IBaseEntity {
  code: TId;
  payment_reference: string;
  order: IOrder;
}

export interface IOrderPaymentRequestsResponse extends IBaseResponse {
  data: IOrderPaymentRequest[];
}

export interface IOrderPaymentRequestCreate {
  code: TId;
  payment_reference: string;
  order_id: TId;
}
