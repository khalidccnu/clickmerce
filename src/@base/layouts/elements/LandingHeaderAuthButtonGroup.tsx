import CustomLink from '@base/components/CustomLink';
import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import { AuthHooks } from '@modules/auth/lib/hooks';
import { useAuthSession } from '@modules/auth/lib/utils/client';
import { Avatar, Button, Grid } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { FaUser } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';

const logoutFn = AuthHooks.useLogout;

interface IProps {
  className?: string;
}

const LandingHeaderAuthButtonGroup: React.FC<IProps> = ({ className }) => {
  const router = useRouter();
  const screens = Grid.useBreakpoint();
  const { isLoading, isAuthenticate, user } = useAuthSession();

  return (
    <div className={cn('landing_header_auth_button_group flex items-center gap-2 md:gap-4', className)}>
      {isLoading ||
        (isAuthenticate ? (
          <>
            <CustomLink href={user?.is_admin ? Paths.admin.aRoot : Paths.user.uRoot}>
              <Avatar>{user?.name?.charAt(0)?.toUpperCase()}</Avatar>
            </CustomLink>
            <Button type="primary" ghost onClick={logoutFn}>
              {screens.md ? 'Log Out' : <IoMdLogOut />}
            </Button>
          </>
        ) : (
          router.pathname === Paths.auth.signIn || (
            <CustomLink href={Paths.auth.signIn}>
              <Button type="primary" ghost>
                {screens.md ? 'Log In' : <FaUser />}
              </Button>
            </CustomLink>
          )
        ))}
    </div>
  );
};

export default LandingHeaderAuthButtonGroup;
