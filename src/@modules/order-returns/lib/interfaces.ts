import { IBaseEntity, IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { IOrder, IOrderCreate } from '@modules/orders/lib/interfaces';

export interface IOrderReturnsFilter extends IBaseFilter {
  customer_id?: TId;
}

export interface IOrderReturn extends IBaseEntity {
  code: TId;
  products: IOrder['products'];
  order: IOrder;
}

export interface IOrderReturnsResponse extends IBaseResponse {
  data: IOrderReturn[];
}

export interface IOrderReturnCreate {
  code: TId;
  products: IOrderCreate['products'];
  order_id: TId;
}
