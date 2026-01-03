import { NextRequest, NextResponse } from 'next/server';

export const redirectFn = (url: string) => {
  return NextResponse.redirect(new URL(url), {
    status: 302,
    headers: { 'Cache-Control': 'no-store' },
  });
};

export const handleGetCookieFn = (req: NextRequest, name: string) => {
  const cookie = req.cookies.get(name);

  if (!cookie) return null;

  try {
    return JSON.parse(cookie.value);
  } catch {
    return null;
  }
};

export const handleSetCookieFn = (res: NextResponse, name: string, value: string, options?: { [key: string]: any }) => {
  res.cookies.set(name, value, options);
};
