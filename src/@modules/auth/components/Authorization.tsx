import { TPermission } from '@lib/constant/permissions';
import { TRole } from '@lib/constant/roles';
import { hasAccess } from '../lib/utils/client';

interface IProps {
  allowedPermissions?: TPermission[];
  allowedRoles?: TRole[];
  disallowedRoles?: TRole[];
  children?: React.ReactNode;
  fallBack?: React.ReactNode;
}

const Authorization: React.FC<IProps> = ({
  allowedPermissions,
  allowedRoles,
  disallowedRoles,
  children = null,
  fallBack = null,
}) => {
  const isAuthorized: boolean = hasAccess({ allowedPermissions, allowedRoles, disallowedRoles });

  return isAuthorized ? children : fallBack;
};

export default Authorization;
