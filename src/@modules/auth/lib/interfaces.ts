import { IBaseResponse, TId } from '@base/interfaces';
import { TPermission } from '@lib/constant/permissions';
import { TRole } from '@lib/constant/roles';

export interface IToken {
  user: {
    id: TId;
    roles: TRole[];
    permissions: TPermission[];
  };
  iat: number;
  exp: number;
}

export interface ISignIn {
  phone: string;
  password: string;
}

export interface ISignInSession {
  token: string;
}

export interface ISignInResponse extends IBaseResponse {
  data: ISignInSession;
}

export interface ISession {
  isLoading: boolean;
  isAuthenticate: boolean;
  user: IToken['user'];
  token: string;
}
