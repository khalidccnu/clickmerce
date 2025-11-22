import { IBaseEntity, IBaseFilter, IBaseResponse } from '@base/interfaces';

export interface ICategoriesFilter extends IBaseFilter {}

export interface ICategory extends IBaseEntity {
  image: string;
  name: string;
  slug: string;
}

export interface ICategoriesResponse extends IBaseResponse {
  data: ICategory[];
}

export interface ICategoryCreate {
  image: string;
  name: string;
  slug: string;
  is_active: string;
}
