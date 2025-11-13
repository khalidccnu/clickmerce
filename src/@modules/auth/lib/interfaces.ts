import { IBaseResponse, TId } from '@base/interfaces';
import { TPermission } from '@lib/constant/permissions';
import { TRole } from '@lib/constant/roles';

export interface IToken {
  user: {
    id: TId;
    name: string;
    phone: string;
    email: string;
    roles: TRole[];
    permissions: TPermission[];
    is_verified: boolean;
  };
  iat: number;
  exp: number;
}

export interface ILogin {
  phone: string;
  password: string;
}

export interface ILoginSession {
  token: string;
  need_verification: boolean;
}

export interface ILoginResponse extends IBaseResponse {
  data: ILoginSession;
}

export interface ISession {
  isLoading: boolean;
  isAuthenticate: boolean;
  user: IToken['user'];
  token: string;
}
