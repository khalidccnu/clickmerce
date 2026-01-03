import { Env } from '.environments';
import { NextRequest, NextResponse } from 'next/server';

export const redirectFn = (url: string) => {
  return NextResponse.redirect(new URL(url), {
    status: 302,
    headers: { 'Cache-Control': 'no-store' },
  });
};

export const handleGetCookieFn = (req: NextRequest, name: string) => {
  const prefix = `${Env.webIdentifier}_`;
  const cookie = req.cookies.get(prefix + name);

  if (!cookie) return null;

  try {
    return JSON.parse(cookie.value);
  } catch {
    return cookie.value;
  }
};

export const handleSetCookieFn = (res: NextResponse, name: string, value: string, options?: { [key: string]: any }) => {
  const prefix = `${Env.webIdentifier}_`;
  const sanitizedName = prefix + name;

  res.cookies.set(sanitizedName, value, options);
};
