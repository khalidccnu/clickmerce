import { Env } from '.environments';
import { TPermission } from '@lib/constant/permissions';
import { Roles, TRole } from '@lib/constant/roles';
import { Cookies } from '@lib/utils/cookies';
import { getNotificationInstance } from '@lib/utils/notificationInstance';
import type { MenuProps, TableColumnsType } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { unAuthorizeSession } from '.';
import { AUTH_TOKEN_KEY } from '../constant';
import { ILoginSession, ISession, IToken } from '../interfaces';

let sessionCache: ISession = null;
let sessionUserCache: ISession['user'] = null;
let permissionsCache: TPermission[] = null;
let rolesCache: TRole[] = null;

export const isJwtExpire = (token: string | IToken): boolean => {
  const decoded = typeof token === 'string' ? jwtDecode<IToken>(token) : token;

  if (!decoded?.exp) return true;

  const expDate = new Date(decoded.exp * 1000);

  return expDate <= new Date();
};

export const extractToken = (token: string): IToken => {
  try {
    const decoded = jwtDecode<IToken>(token);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const getAuthToken = (): string => {
  try {
    const token = Cookies.getData(AUTH_TOKEN_KEY);
    return token;
  } catch (error) {
    return null;
  }
};

export const getAuthSession = (): ISession => {
  if (sessionCache && !isJwtExpire(sessionCache.token)) {
    return sessionCache;
  }

  try {
    const token = Cookies.getData(AUTH_TOKEN_KEY);

    if (!token) return unAuthorizeSession;

    const tokenDec: IToken = jwtDecode(token);
    const isExpire = isJwtExpire(tokenDec);

    if (isExpire) return unAuthorizeSession;

    const session = {
      isLoading: false,
      isAuthenticate: true,
      user: {
        ...tokenDec.user,
      },
      token,
    };

    sessionCache = session;
    sessionUserCache = session.user;

    return session;
  } catch (error) {
    return unAuthorizeSession;
  }
};

export const setAuthSession = (session: ILoginSession): ISession => {
  try {
    const token = session.token;

    if (!token) return unAuthorizeSession;

    const tokenDec: IToken = jwtDecode(token);
    const tokenExp = new Date(tokenDec.exp * 1000);

    sessionCache = null;
    sessionUserCache = null;
    permissionsCache = null;
    rolesCache = null;

    Cookies.setData(AUTH_TOKEN_KEY, token, tokenExp);

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

export const clearAuthSession = (): boolean => {
  try {
    Cookies.removeData(AUTH_TOKEN_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

export const useAuthSession = (): ISession => {
  const [session, setSession] = useState<ISession>(() => getAuthSession());

  useEffect(() => setSession(getAuthSession()), []);

  return session;
};

export const getPermissions = (): TPermission[] => {
  if (!sessionUserCache) {
    sessionUserCache = getAuthSession().user;
  }

  if (!sessionUserCache) return [];
  if (permissionsCache) return permissionsCache;

  permissionsCache = sessionUserCache.permissions ?? [];

  return permissionsCache;
};

export const getRoles = (): TRole[] => {
  if (!sessionUserCache) {
    sessionUserCache = getAuthSession().user;
  }

  if (!sessionUserCache) return [];
  if (rolesCache) return rolesCache;

  rolesCache = sessionUserCache.roles ?? [];

  return rolesCache;
};

export const hasAccess = ({
  allowedPermissions = [] as TPermission[],
  allowedRoles = [] as TRole[],
  disallowedRoles = [] as TRole[],
}): boolean => {
  if (Env.isEnableRBAC === 'false') return true;

  const user = sessionUserCache || getAuthSession().user;

  if (!user) return false;
  if (user.roles?.includes(Roles.SUPER_ADMIN)) return true;

  const permissions = getPermissions();
  const permissionCheck =
    allowedPermissions.length === 0 || allowedPermissions.some((permission) => permissions.includes(permission));

  const roles = getRoles();
  let roleCheck = true;

  if (allowedRoles.length) roleCheck = roles.some((role) => allowedRoles.includes(role));
  if (disallowedRoles.length) roleCheck = roles.every((role) => !disallowedRoles.includes(role));

  return permissionCheck && roleCheck;
};

export const getAccess = ({
  allowedPermissions = [] as TPermission[],
  allowedRoles = [] as TRole[],
  disallowedRoles = [] as TRole[],
  func,
  message = 'Unauthorized Access!',
}: {
  allowedPermissions?: TPermission[];
  allowedRoles?: TRole[];
  disallowedRoles?: TRole[];
  func: () => void;
  message?: string;
}) => {
  const notification = getNotificationInstance();
  const allowed = hasAccess({ allowedPermissions, allowedRoles, disallowedRoles });

  return allowed ? func() : notification.error({ message });
};

interface IGetContentAccess<T> {
  content: T;
  allowedPermissions?: TPermission[];
  allowedRoles?: TRole[];
  disallowedRoles?: TRole[];
}

export const getContentAccess = <T>({
  content,
  allowedPermissions = [],
  allowedRoles = [],
  disallowedRoles = [],
}: IGetContentAccess<T>): T => (hasAccess({ allowedPermissions, allowedRoles, disallowedRoles }) ? content : null);

interface IGetColumnsAccess<Record> {
  columns: TableColumnsType<Record>;
  allowedPermissions?: TPermission[];
  allowedRoles?: TRole[];
  disallowedRoles?: TRole[];
}

export const getColumnsAccess = <Record>({
  columns,
  allowedPermissions = [],
  allowedRoles = [],
  disallowedRoles = [],
}: IGetColumnsAccess<Record>): TableColumnsType<Record> =>
  hasAccess({ allowedPermissions, allowedRoles, disallowedRoles }) ? columns : [];

interface IGetNodeAccess {
  node: React.ReactNode;
  allowedPermissions?: TPermission[];
  allowedRoles?: TRole[];
  disallowedRoles?: TRole[];
  fallBack?: React.ReactNode;
}

export const getNodeAccess = ({
  node,
  allowedPermissions = [],
  allowedRoles = [],
  disallowedRoles = [],
  fallBack = null,
}: IGetNodeAccess): React.ReactNode =>
  hasAccess({ allowedPermissions, allowedRoles, disallowedRoles }) ? node : fallBack;

export type TMenuItems = {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  allowedPermissions?: TPermission[];
  allowedRoles?: TRole[];
  disallowedRoles?: TRole[];
  children?: TMenuItems[];
};

export const getMenuItemsAccess = (menuItems: TMenuItems[]): MenuProps['items'] => {
  const items: MenuProps['items'] = menuItems
    .map((item) => {
      const allowed = hasAccess({
        allowedPermissions: item.allowedPermissions ?? [],
        allowedRoles: item.allowedRoles ?? [],
        disallowedRoles: item.disallowedRoles ?? [],
      });

      if (!allowed) return null;

      const children = item.children ? getMenuItemsAccess(item.children) : undefined;

      return {
        key: item.key,
        label: item.label,
        icon: item.icon,
        children,
      };
    })
    .filter(Boolean) as MenuProps['items'];

  return items;
};
