import { AuthPaths } from '@lib/constant/authPaths';
import { Paths } from '@lib/constant/paths';
import { Toolbox } from '@lib/utils/toolbox';
import React, { type PropsWithChildren } from 'react';
import AdminLayout from './AdminLayout';
import PosLayout from './PosLayout';

interface IProps extends PropsWithChildren {
  pathname: string;
}

const WithLayout: React.FC<IProps> = ({ pathname, children }) => {
  if (pathname === Paths.admin.pos) {
    return <PosLayout>{children}</PosLayout>;
  }

  return Toolbox.isDynamicPath(AuthPaths, pathname) ? <AdminLayout>{children}</AdminLayout> : children;
};

export default WithLayout;
