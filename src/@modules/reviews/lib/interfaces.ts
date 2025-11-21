import { IBaseEntity, IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { IProduct } from '@modules/products/lib/interfaces';
import { IUser } from '@modules/users/lib/interfaces';

export interface IReviewsFilter extends IBaseFilter {
  user_id?: TId;
  product_id?: TId;
}

export interface IReview extends IBaseEntity {
  image: string;
  comment: string;
  rate: number;
  user_id: TId;
  user: IUser;
  product_id: TId;
  product: IProduct;
}

export interface IReviewsResponse extends IBaseResponse {
  data: IReview[];
}

export interface IReviewCreate {
  image: string;
  comment: string;
  rate: number;
  user_id: TId;
  product_id: TId;
  is_active: string;
}
