import BrandLogo from '@base/components/BrandLogo';
import CustomLink from '@base/components/CustomLink';
import { Paths } from '@lib/constant/paths';
import { States } from '@lib/constant/states';
import useLocalState from '@lib/hooks/useLocalState';
import { cn } from '@lib/utils/cn';
import { Badge, Button } from 'antd';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { BsCart3, BsHeart } from 'react-icons/bs';
import { FaBars } from 'react-icons/fa';
import LandingMenu from './LandingMenu';

const LandingHeaderAuthButtonGroup = dynamic(() => import('./LandingHeaderAuthButtonGroup'), { ssr: false });

interface IProps {
  className?: string;
}

const LandingHeader = React.forwardRef<HTMLElement, IProps>(({ className }, ref) => {
  const [order] = useLocalState(States.order);
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <React.Fragment>
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
            <Button type="primary" onClick={() => setMenuOpen(true)}>
              <FaBars />
            </Button>
          </div>
        </div>
      </header>
      <LandingMenu isOpen={isMenuOpen} onChangeOpen={() => setMenuOpen(false)} />
    </React.Fragment>
  );
});

LandingHeader.displayName = 'LandingHeader';

export default LandingHeader;
