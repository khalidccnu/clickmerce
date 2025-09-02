import { Cookies } from '@lib/utils/cookies';
import { jwtDecode } from 'jwt-decode';
import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';
import { unAuthorizeSession } from '.';
import { AUTH_TOKEN_KEY } from '../constant';
import { ISession, IToken } from '../interfaces';

export const isJwtExpire = (token: string | IToken): boolean => {
  const decoded = typeof token === 'string' ? jwtDecode<IToken>(token) : token;

  if (!decoded?.exp) return true;

  const expDate = new Date(decoded.exp * 1000);

  return expDate <= new Date();
};

export const getServerAuthToken = (req: NextApiRequest | NextRequest): string => {
  try {
    const sanitizedName = Cookies.prefix + AUTH_TOKEN_KEY;
    const token =
      (req as NextApiRequest).cookies[sanitizedName] || (req as NextRequest).cookies.get(sanitizedName)?.value;

    return token;
  } catch (error) {
    return null;
  }
};

export const getServerAuthSession = (req: NextApiRequest | NextRequest): ISession => {
  try {
    const token = getServerAuthToken(req);

    if (!token) return unAuthorizeSession;

    const tokenDec = jwtDecode<IToken>(token);
    const isExpire = isJwtExpire(tokenDec);

    if (isExpire) return unAuthorizeSession;

    return {
      isLoading: false,
      isAuthenticate: true,
      user: {
        ...tokenDec.user,
      },
      token,
    };
  } catch (error) {
    return unAuthorizeSession;
  }
};
