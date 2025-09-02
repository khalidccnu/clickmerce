import BrandLogo from '@base/components/BrandLogo';
import CustomLink from '@base/components/CustomLink';
import { Paths } from '@lib/constant/paths';
import { States } from '@lib/constant/states';
import { useClickOutside } from '@lib/hooks/useClickOutside';
import useLocalState from '@lib/hooks/useLocalState';
import useResize from '@lib/hooks/useResize';
import useSessionState from '@lib/hooks/useSessionState';
import useTheme from '@lib/hooks/useTheme';
import { Button, FloatButton, Grid, Layout } from 'antd';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import React, { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';

const AdminMenu = dynamic(() => import('./elements/AdminMenu'), { ssr: false });
const WelcomeMenu = dynamic(() => import('./elements/WelcomeMenu'), { ssr: false });

interface IMenu {
  openMenuKeys: string[];
}

interface IProps extends PropsWithChildren {}

const AdminLayout: React.FC<IProps> = ({ children }) => {
  const pathname = usePathname();
  const screens = Grid.useBreakpoint();
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useSessionState(States.headerHeight);
  const [isCollapsed, setCollapsed] = useState(false);
  const [menu, setMenu] = useLocalState<IMenu>(States.menu);
  const { elemRef: siderRef, width: siderWidth } = useResize<HTMLDivElement>();
  const siderFloatButtonRef = useRef(null);
  const { isLight } = useTheme();

  useClickOutside([siderRef, siderFloatButtonRef], () => (screens.md ? null : setCollapsed(true)));

  const styles: any = {
    sider: {
      position: 'fixed',
      top: 0,
      left: isCollapsed ? '-100%' : 0,
      height: '100vh',
      borderRight: screens.md ? 'none' : '1px solid var(--color-gray-200)',
      background: isLight ? 'var(--color-white)' : 'var(--color-rich-black)',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 100,
    },
    menuWrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      paddingBlock: 16,
      overflowY: 'auto',
    },
    layout: {
      paddingLeft: !screens.md || isCollapsed ? 0 : siderWidth,
      background: 'transparent',
    },
    header: {
      position: 'sticky',
      top: 0,
      left: 0,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: 16,
      background: isLight ? 'var(--color-white)' : 'var(--color-rich-black)',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 99,
    },
  };

  useEffect(() => {
    if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerRef.current?.offsetHeight]);

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Layout.Sider
        ref={siderRef}
        collapsible
        trigger={null}
        collapsed={isCollapsed}
        width={280}
        style={styles.sider}
        breakpoint="md"
        theme="light"
        onBreakpoint={(broken) => {
          if (broken) setCollapsed(true);
        }}
        onClick={(e) => {
          if (!screens.md && (e.target as HTMLAnchorElement).href) setCollapsed(true);
        }}
      >
        <div
          style={styles.menuWrapper}
          className="[&_.ant-menu]:!bg-transparent [&_.ant-menu]:!border-none designed_scrollbar overscroll-contain"
        >
          <div style={{ height: `calc(${headerHeight}px - 16px)` }} className="place-self-center place-content-center">
            <CustomLink href={Paths.root}>
              <BrandLogo width={220} />
            </CustomLink>
          </div>
          <AdminMenu
            className="mt-4"
            selectedKeys={[pathname]}
            openKeys={menu?.openMenuKeys}
            onOpenChange={(keys) => setMenu({ openMenuKeys: keys })}
          />
        </div>
      </Layout.Sider>
      <Layout style={styles.layout}>
        <Layout.Header style={styles.header} ref={headerRef}>
          <Button type="text" size="large" onClick={() => setCollapsed((prev) => !prev)}>
            <MdOutlineKeyboardDoubleArrowRight size={24} className={isCollapsed ? 'rotate-0' : 'rotate-180'} />
          </Button>
          <WelcomeMenu />
        </Layout.Header>
        <Layout.Content>
          <div className="md:h-full container py-4">{children}</div>
        </Layout.Content>
      </Layout>
      <FloatButton
        ref={siderFloatButtonRef}
        style={{
          display: screens.md || isCollapsed ? 'none' : 'block',
        }}
        icon={<IoClose />}
        onClick={() => setCollapsed((prev) => !prev)}
      />
    </Layout>
  );
};

export default AdminLayout;
