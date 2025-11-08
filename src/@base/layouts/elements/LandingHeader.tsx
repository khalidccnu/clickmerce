import BrandLogo from '@base/components/BrandLogo';
import CustomLink from '@base/components/CustomLink';
import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import dynamic from 'next/dynamic';
import React from 'react';

const LandingHeaderAuthButtonGroup = dynamic(() => import('./LandingHeaderAuthButtonGroup'), { ssr: false });

interface IProps {
  className?: string;
}

const LandingHeader = React.forwardRef<HTMLElement, IProps>(({ className }, ref) => {
  return (
    <header className={cn('header', className)} ref={ref}>
      <div className="container">
        <div className="wrapper flex items-center gap-2 md:gap-4">
          <CustomLink href={Paths.root}>
            <BrandLogo />
          </CustomLink>
          <LandingHeaderAuthButtonGroup className="ml-auto" />
        </div>
      </div>
    </header>
  );
});

LandingHeader.displayName = 'LandingHeader';

export default LandingHeader;
