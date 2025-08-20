import { Env } from '.environments';
import { AuthPaths } from '@lib/constant/authPaths';
import { Paths } from '@lib/constant/paths';
import { UnAuthPaths } from '@lib/constant/unAuthPaths';
import { Toolbox } from '@lib/utils/toolbox';
import { REDIRECT_PREFIX } from '@modules/auth/lib/constant';
import { ISession } from '@modules/auth/lib/interfaces';
import { getServerAuthSession } from '@modules/auth/lib/utils';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_FILE_PATTERN = /\.(.*)$/;

const redirectFn = (url: string) =>
  NextResponse.redirect(new URL(url), {
    status: 302,
    headers: { 'Cache-Control': 'no-store' },
  });

export default async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const { host: hostname, protocol, pathname, search } = req.nextUrl;
  const host = req.headers.get('x-forwarded-host') || hostname;
  const hostProtocol = req.headers.get('x-forwarded-proto') || protocol;
  const origin = `${hostProtocol}://${host}`;

  // Skip paths
  if (pathname.startsWith('/_next') || pathname.includes('/api/') || PUBLIC_FILE_PATTERN.test(pathname)) {
    return response;
  }

  // Check initiate
  try {
    const initiateUrl = `${origin}${Env.apiUrl}/${Paths.initiate}`;
    const initiateResponse = await fetch(initiateUrl);
    const initiate = await initiateResponse.json();

    if (pathname.startsWith(Paths.underConstruction) && search.includes(REDIRECT_PREFIX)) {
      const decodedUrl = decodeURIComponent(search.split(`${REDIRECT_PREFIX}=`)[1]);
      return redirectFn(decodedUrl);
    }

    if (pathname.startsWith(Paths.initiate) && initiate.data.success) {
      return redirectFn(origin);
    }

    if (!pathname.startsWith(Paths.initiate) && !initiate.data.success) {
      return redirectFn(`${origin}${Paths.initiate}`);
    }
  } catch {
    if (!pathname.startsWith(Paths.underConstruction)) {
      const encodedUrl = encodeURIComponent(`${origin}${pathname}${search}`);
      return redirectFn(`${origin}${Paths.underConstruction}?${REDIRECT_PREFIX}=${encodedUrl}`);
    }
  }

  // Get session once
  let sessionCache: ISession = null;

  try {
    sessionCache = getServerAuthSession(req);
  } catch {}

  // Handle unauthenticated paths
  if (UnAuthPaths.includes(pathname)) {
    if (sessionCache?.isAuthenticate) {
      return redirectFn(`${origin}${Paths.admin.root}`);
    }

    return response;
  }

  // Handle authenticated paths
  if (Toolbox.isDynamicPath(AuthPaths, pathname)) {
    if (!sessionCache?.isAuthenticate) {
      const encodedUrl = encodeURIComponent(`${origin}${pathname}${search}`);
      return redirectFn(`${origin}${Paths.auth.signIn}?${REDIRECT_PREFIX}=${encodedUrl}`);
    }

    return response;
  }

  return response;
}
