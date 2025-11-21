import BrandLogo from '@base/components/BrandLogo';
import CustomLink from '@base/components/CustomLink';
import { Paths } from '@lib/constant/paths';
import { States } from '@lib/constant/states';
import useLocalState from '@lib/hooks/useLocalState';
import { cn } from '@lib/utils/cn';
import { Badge } from 'antd';
import dynamic from 'next/dynamic';
import React from 'react';
import { BsCart3, BsHeart } from 'react-icons/bs';

const LandingHeaderAuthButtonGroup = dynamic(() => import('./LandingHeaderAuthButtonGroup'), { ssr: false });

interface IProps {
  className?: string;
}

const LandingHeader = React.forwardRef<HTMLElement, IProps>(({ className }, ref) => {
  const [order] = useLocalState(States.order);

  return (
    <header className={cn('header', className)} ref={ref}>
      <div className="container">
        <div className="wrapper flex items-center gap-2 md:gap-4">
          <CustomLink href={Paths.root} style={{ marginRight: 'auto' }}>
            <BrandLogo />
          </CustomLink>
          <Badge count={order?.wishlist?.length || 0} size="small" offset={[0, 0]}>
            <CustomLink href={Paths.wishlist}>
              <BsHeart size={20} className="mt-2" />
            </CustomLink>
          </Badge>
          <Badge count={order?.cart?.length || 0} size="small" offset={[0, 0]}>
            <CustomLink href={Paths.cart}>
              <BsCart3 size={20} className="mt-1" />
            </CustomLink>
          </Badge>
          <LandingHeaderAuthButtonGroup />
        </div>
      </div>
    </header>
  );
});

LandingHeader.displayName = 'LandingHeader';

export default LandingHeader;
