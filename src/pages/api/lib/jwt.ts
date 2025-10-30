import { Env } from '.environments';
import { IToken } from '@modules/auth/lib/interfaces';
import { sign, verify } from 'jsonwebtoken';

export const jwtSign = (payload: { user: IToken['user'] }): string => {
  return sign(payload, Env.supabaseJwtSecret, { algorithm: 'HS256', expiresIn: 60 * 60 * 24 * 7 });
};

export const jwtVerify = (token: string): IToken => {
  try {
    return verify(token, Env.supabaseJwtSecret) as IToken;
  } catch (error) {
    return null;
  }
};
