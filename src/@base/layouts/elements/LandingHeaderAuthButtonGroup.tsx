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
    <div className={cn('btn_wrapper flex items-center gap-2 md:gap-4', className)}>
      {isLoading ||
        (isAuthenticate ? (
          <>
            <CustomLink href={Paths.users.root}>
              <Avatar>{user?.name?.charAt(0)?.toUpperCase()}</Avatar>
            </CustomLink>
            <Button type="primary" ghost onClick={logoutFn}>
              {screens.md ? 'Sign Out' : <IoMdLogOut />}
            </Button>
          </>
        ) : (
          router.pathname === Paths.auth.signIn || (
            <CustomLink href={Paths.auth.signIn}>
              <Button type="primary">{screens.md ? 'Sign In' : <FaUser />}</Button>
            </CustomLink>
          )
        ))}
    </div>
  );
};

export default LandingHeaderAuthButtonGroup;
