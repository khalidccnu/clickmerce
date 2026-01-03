import { Env } from '.environments';
import { IBaseResponse } from '@base/interfaces';
import { AdminPaths, AuthPaths } from '@lib/constant/authPaths';
import { Database } from '@lib/constant/database';
import { InternalViewPaths, Paths } from '@lib/constant/paths';
import { UnAuthPaths } from '@lib/constant/unAuthPaths';
import { handleGetCookieFn, handleSetCookieFn, redirectFn } from '@lib/utils/middleware';
import { Toolbox } from '@lib/utils/toolbox';
import { REDIRECT_PREFIX } from '@modules/auth/lib/constant';
import { ISession } from '@modules/auth/lib/interfaces';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_FILE_PATTERN = /\.(.*)$/;

export default async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const { host: hostname, protocol, pathname, search } = req.nextUrl;
  const host = req.headers.get('x-forwarded-host') || hostname;
  const hostProtocol = req.headers.get('x-forwarded-proto') || protocol;
  const origin = `${hostProtocol}://${host}`;

  // Skip paths
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/') || PUBLIC_FILE_PATTERN.test(pathname)) {
    return response;
  }

  // Get session once
  let sessionCache: ISession = null;

  try {
    sessionCache = getServerAuthSession(req);
  } catch {}

  try {
    let settings: IBaseResponse<{
      identity: { need_web_view: ISettingsIdentity['need_web_view'] };
    }> = handleGetCookieFn(req, SettingsServices.NAME);

    if (!settings) {
      const settingsUrl = `${origin}${Env.apiUrl}/${Database.settings}`;

      const settingsResponse = await fetch(settingsUrl, {
        cache: 'no-store',
      });

      if (!settingsResponse.ok) {
        throw new Error(settingsResponse.statusText || 'Failed to fetch settings');
      }

      settings = await settingsResponse.json();

      handleSetCookieFn(
        response,
        SettingsServices.NAME,
        JSON.stringify({
          ...settings,
          data: {
            identity: {
              need_web_view: settings.data?.identity.need_web_view ?? false,
            },
          },
        }),
        {
          httpOnly: true,
          sameSite: 'lax',
          secure: Env.isProduction,
        },
      );
    }

    if (pathname.startsWith(Paths.underConstruction) && search.includes(REDIRECT_PREFIX) && settings?.data) {
      const decodedUrl = decodeURIComponent(search.split(`${REDIRECT_PREFIX}=`)[1]);
      return redirectFn(decodedUrl);
    }

    if (pathname.startsWith(Paths.initiate) && settings?.data) {
      return redirectFn(origin);
    }

    if (!pathname.startsWith(Paths.initiate) && !settings.data) {
      return redirectFn(`${origin}${Paths.initiate}`);
    }

    const identity = settings.data?.identity;
    const needWebView = identity?.need_web_view;

    if (!needWebView && !InternalViewPaths.includes(pathname)) {
      if (pathname === Paths.root) {
        return redirectFn(`${origin}${Paths.auth.signIn}`);
      } else {
        return redirectFn(`${origin}${Paths.underConstruction}`);
      }
    }
  } catch {
    if (!pathname.startsWith(Paths.underConstruction)) {
      const encodedUrl = encodeURIComponent(`${origin}${pathname}${search}`);
      return redirectFn(`${origin}${Paths.underConstruction}?${REDIRECT_PREFIX}=${encodedUrl}`);
    }
  }

  // Handle unauthenticated paths
  if (UnAuthPaths.includes(pathname)) {
    if (sessionCache?.isAuthenticate) {
      return redirectFn(`${origin}${Paths.admin.aRoot}`);
    }

    return response;
  }

  // Handle authenticated paths
  if (Toolbox.isDynamicPath(AuthPaths, pathname)) {
    if (!sessionCache?.isAuthenticate) {
      const encodedUrl = encodeURIComponent(`${origin}${pathname}${search}`);
      return redirectFn(`${origin}${Paths.auth.signIn}?${REDIRECT_PREFIX}=${encodedUrl}`);
    }

    if (Toolbox.isDynamicPath(AdminPaths, pathname) && !sessionCache?.user?.is_admin) {
      return redirectFn(`${origin}${Paths.user.uRoot}`);
    }

    return response;
  }

  return response;
}
