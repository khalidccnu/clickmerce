import { IBaseEntity, IBaseFilter, IBaseResponse } from '@base/interfaces';

export interface IGalleriesFilter extends IBaseFilter {}

export interface IGallery extends IBaseEntity {
  file_name: string;
  file_path: string;
  file_url: string;
  bucket: string;
  etag: string;
  version_id: string;
}

export interface IGalleriesResponse extends IBaseResponse {
  data: IGallery[];
}

export interface IGalleryCreate {
  type: 'FILE' | 'URL';
  make_public: boolean;
  files: File[];
}
