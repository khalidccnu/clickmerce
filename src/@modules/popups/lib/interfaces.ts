import { IBaseEntity, IBaseFilter, IBaseResponse } from '@base/interfaces';
import { TPopupType } from './enums';

export interface IPopupsFilter extends IBaseFilter {}

export interface IPopup extends IBaseEntity {
  type: TPopupType;
  name: string;
  image: string;
  content: string;
}

export interface IPopupsResponse extends IBaseResponse {
  data: IPopup[];
}

export interface IPopupCreate {
  type: TPopupType;
  name: string;
  image: string;
  content: string;
  is_active: string;
}
