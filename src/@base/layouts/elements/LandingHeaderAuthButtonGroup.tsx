import CustomLink from '@base/components/CustomLink';
import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { AuthHooks } from '@modules/auth/lib/hooks';
import { useAuthSession } from '@modules/auth/lib/utils/client';
import { Button, Grid } from 'antd';
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
            <div className="relative w-11 h-11 p-1 border border-gray-300 rounded-full">
              <CustomLink type="hoverable" title={Paths.users.root} href={Paths.users.root} />
              <img
                src={Toolbox.generateCharacterSvg({ character: user?.name, type: 'url' })}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <Button type="primary" size="large" ghost onClick={logoutFn}>
              {screens.md ? 'Sign Out' : <IoMdLogOut />}
            </Button>
          </>
        ) : (
          router.pathname === Paths.auth.signIn || (
            <CustomLink href={Paths.auth.signIn}>
              <Button type="primary" size="large">
                {screens.md ? 'Sign In' : <FaUser />}
              </Button>
            </CustomLink>
          )
        ))}
    </div>
  );
};

export default LandingHeaderAuthButtonGroup;
