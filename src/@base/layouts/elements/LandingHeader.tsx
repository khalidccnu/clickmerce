import BrandLogo from '@base/components/BrandLogo';
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

interface IProps {
  className?: string;
}

const signOutFn = AuthHooks.useSignOut;

const LandingHeader = React.forwardRef<HTMLElement, IProps>(({ className }, ref) => {
  const router = useRouter();
  const screens = Grid.useBreakpoint();
  const { isLoading, isAuthenticate, user } = useAuthSession();

  return (
    <header className={cn('header', className)} ref={ref}>
      <div className="container">
        <div className="wrapper flex items-center gap-2 md:gap-4">
          <CustomLink href={Paths.root}>
            <BrandLogo />
          </CustomLink>
          <div className="btn_wrapper ml-auto flex items-center gap-2 md:gap-4">
            {isLoading ||
              (isAuthenticate ? (
                <React.Fragment>
                  <div className="relative w-11 h-11 p-1 border border-gray-300 rounded-full">
                    <CustomLink type="hoverable" title={Paths.users.root} href={Paths.users.root} />
                    <img
                      src={Toolbox.generateCharacterSvg({ character: user?.name, type: 'url' })}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button type="primary" size="large" ghost onClick={signOutFn}>
                    {screens.md ? 'Sign Out' : <IoMdLogOut />}
                  </Button>
                </React.Fragment>
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
        </div>
      </div>
    </header>
  );
});

LandingHeader.displayName = 'LandingHeader';

export default LandingHeader;
