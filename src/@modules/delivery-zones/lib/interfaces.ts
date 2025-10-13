import { IBaseEntity, IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { IDeliveryServiceType } from '@modules/delivery-service-types/lib/interfaces';

export interface IDeliveryZonesFilter extends IBaseFilter {
  delivery_service_type_id?: TId;
}

export interface IDeliveryZone extends IBaseEntity {
  name: string;
  delivery_service_type: IDeliveryServiceType;
}

export interface IDeliveryZonesResponse extends IBaseResponse {
  data: IDeliveryZone[];
}

export interface IDeliveryZoneCreate {
  name: string;
  delivery_service_type_id: TId;
  is_active: string;
}
