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
  return Toolbox.isDynamicPath(AuthPaths, pathname) ? (
    pathname === Paths.admin.pos ? (
      <PosLayout>{children}</PosLayout>
    ) : (
      <AdminLayout>{children}</AdminLayout>
    )
  ) : (
    children
  );
};

export default WithLayout;
