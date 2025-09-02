import { TPermission } from '@lib/constant/permissions';
import { TRole } from '@lib/constant/roles';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';
import { hasAccess } from '../lib/utils/client';

interface IOptions {
  allowedPermissions?: TPermission[];
  allowedRoles?: TRole[];
  disallowedRoles?: TRole[];
  fallBack?: React.ReactNode;
}

const WithAuthorization = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  {
    allowedPermissions,
    allowedRoles,
    disallowedRoles,
    fallBack = (
      <div className="flex justify-center">
        <div className="flex flex-col items-center bg-white dark:bg-[var(--color-rich-black)] p-5 rounded-lg shadow-md">
          <RiAlarmWarningFill color="#ef4444" size={32} className="animate-pulse" />
          <h3 className="text-2xl font-bold text-red-500">Unauthorized Access</h3>
          <p className="mt-2 text-gray-500">You do not have permission to access this page!</p>
        </div>
      </div>
    ),
  }: IOptions,
) => {
  const AuthorizationComponent: React.FC<P> = (props) => {
    const [isLoading, setLoading] = useState(true);
    const [isAuthorized, setAuthorized] = useState(false);

    useEffect(() => {
      setAuthorized(hasAccess({ allowedPermissions, allowedRoles, disallowedRoles }));
      setLoading(false);
    }, []);

    return isLoading ? <Spin /> : isAuthorized ? <WrappedComponent {...props} /> : fallBack;
  };

  AuthorizationComponent.displayName = `WithAuthorization(${WrappedComponent.displayName || 'Component'})`;
  return AuthorizationComponent;
};

export default WithAuthorization;
