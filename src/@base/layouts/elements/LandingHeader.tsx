import BrandLogo from '@base/components/BrandLogo';
import CustomLink from '@base/components/CustomLink';
import ThemeToggler from '@base/components/ThemeToggler';
import ProductsSearchForm from '@components/ProductsSearchForm';
import { Paths } from '@lib/constant/paths';
import { States } from '@lib/constant/states';
import useLocalState from '@lib/hooks/useLocalState';
import { cn } from '@lib/utils/cn';
import { Badge, Button, Grid } from 'antd';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { BsCart3, BsHeart } from 'react-icons/bs';
import { FaBars } from 'react-icons/fa';
import LandingHeaderNotices from './LandingHeaderNotices';
import LandingMenu from './LandingMenu';

const LandingHeaderAuthButtonGroup = dynamic(() => import('./LandingHeaderAuthButtonGroup'), { ssr: false });

interface IProps {
  className?: string;
}

const LandingHeader = React.forwardRef<HTMLElement, IProps>(({ className }, ref) => {
  const screens = Grid.useBreakpoint();
  const [order] = useLocalState(States.order);
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <React.Fragment>
      <header className={cn('header', className)} ref={ref}>
        <div className="container">
          <LandingHeaderNotices className="mb-4" />
          <div className="wrapper flex items-center justify-between gap-2 md:gap-4">
            <CustomLink href={Paths.root}>
              <BrandLogo />
            </CustomLink>
            <ProductsSearchForm className="w-full max-w-sm hidden lg:block" />
            <div className="flex items-center gap-2 md:gap-4">
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
              {screens.md && <ThemeToggler />}
            </div>
          </div>
        </div>
      </header>
      <LandingMenu isOpen={isMenuOpen} onChangeOpen={() => setMenuOpen(false)} />
    </React.Fragment>
  );
});

LandingHeader.displayName = 'LandingHeader';

export default LandingHeader;
