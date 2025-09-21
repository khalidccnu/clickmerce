import { IBaseEntity, IBaseFilter, IBaseResponse } from '@base/interfaces';

export interface IDosageFormsFilter extends IBaseFilter {}

export interface IDosageForm extends IBaseEntity {
  name: string;
  slug: string;
}

export interface IDosageFormsResponse extends IBaseResponse {
  data: IDosageForm[];
}

export interface IDosageFormCreate {
  name: string;
  slug: string;
  is_active: string;
}
