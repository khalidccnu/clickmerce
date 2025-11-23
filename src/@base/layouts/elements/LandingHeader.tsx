import BaseStateSearch from '@base/components/BaseStateSearch';
import BrandLogo from '@base/components/BrandLogo';
import CustomLink from '@base/components/CustomLink';
import ThemeToggler from '@base/components/ThemeToggler';
import { Paths } from '@lib/constant/paths';
import { States } from '@lib/constant/states';
import useLocalState from '@lib/hooks/useLocalState';
import useTheme from '@lib/hooks/useTheme';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { ProductsHooks } from '@modules/products/lib/hooks';
import { Avatar, Badge, Button, Dropdown, Grid, List, Spin } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BsCart3, BsHeart } from 'react-icons/bs';
import { FaBars, FaSearch } from 'react-icons/fa';
import LandingMenu from './LandingMenu';

const LandingHeaderAuthButtonGroup = dynamic(() => import('./LandingHeaderAuthButtonGroup'), { ssr: false });

interface IProps {
  className?: string;
}

const LandingHeader = React.forwardRef<HTMLElement, IProps>(({ className }, ref) => {
  const router = useRouter();
  const screens = Grid.useBreakpoint();
  const { isDark } = useTheme();
  const [order] = useLocalState(States.order);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(null);

  const productsQuery = ProductsHooks.useFindByFuzzy({
    name: searchTerm,
    config: {
      queryKey: [],
      enabled: !!searchTerm,
    },
  });

  return (
    <React.Fragment>
      <header className={cn('header', className)} ref={ref}>
        <div className="container">
          <div className="wrapper flex items-center justify-between gap-2 md:gap-4">
            <CustomLink href={Paths.root}>
              <BrandLogo />
            </CustomLink>
            <div className="w-full max-w-sm hidden lg:block">
              <Dropdown
                open={!!searchTerm}
                trigger={['click']}
                placement="bottomLeft"
                popupRender={() => (
                  <div
                    style={{
                      background: isDark ? '#141414' : '#fff',
                      minWidth: 300,
                      maxHeight: 380,
                      borderRadius: 8,
                      overflowY: 'auto',
                      overscrollBehavior: 'contain',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    {productsQuery.isLoading ? (
                      <div className="p-4 text-center">
                        <Spin />
                      </div>
                    ) : productsQuery.data?.data?.length ? (
                      <List
                        itemLayout="horizontal"
                        dataSource={productsQuery.data?.data}
                        renderItem={(item) => (
                          <List.Item
                            key={item?.product?.id}
                            onClick={() => {
                              router.push(Paths.products.toSlug(item?.product?.slug));
                              setSearchTerm(null);
                            }}
                          >
                            <List.Item.Meta
                              style={{ paddingInline: 16, cursor: 'pointer' }}
                              avatar={
                                <Avatar
                                  size={48}
                                  shape="square"
                                  src={
                                    item?.product?.images?.[0]?.url ||
                                    Toolbox.generateCharacterSvg({ character: item?.product?.name, type: 'url' })
                                  }
                                  alt={item?.product?.name}
                                  className="mr-2"
                                />
                              }
                              title={<span className="font-medium line-clamp-1">{item?.product?.name}</span>}
                              description={
                                <div className="text-xs text-gray-500">
                                  <span>{Toolbox.toPrettyText(item?.product?.type)}</span>
                                  {item?.product?.specification && (
                                    <span className="ml-1">| {item?.product?.specification}</span>
                                  )}
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">No matching products</div>
                    )}
                  </div>
                )}
              >
                <BaseStateSearch
                  prefix={<FaSearch />}
                  placeholder="Search products"
                  allowClear
                  onSearch={setSearchTerm}
                />
              </Dropdown>
            </div>
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
