import ThemeToggler from '@base/components/ThemeToggler';
import { States } from '@lib/constant/states';
import { useClickOutside } from '@lib/hooks/useClickOutside';
import useLocalState from '@lib/hooks/useLocalState';
import useTheme from '@lib/hooks/useTheme';
import { Toolbox } from '@lib/utils/toolbox';
import { useAuthSession } from '@modules/auth/lib/utils/client';
import { FloatButton, Grid, Layout } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { CgMenuGridO } from 'react-icons/cg';

const UserMenu = dynamic(() => import('./elements/UserMenu'), { ssr: false });

interface IMenu {
  openMenuKeys: string[];
}

interface IProps extends PropsWithChildren {}

const UserLayout: React.FC<IProps> = ({ children }) => {
  const pathname = usePathname();
  const screens = Grid.useBreakpoint();
  const [isCollapsed, setCollapsed] = useState(false);
  const [menu, setMenu] = useLocalState<IMenu>(States.menu);
  const siderRef = useRef(null);
  const siderFloatButtonRef = useRef(null);
  const { isLight } = useTheme();
  const { user } = useAuthSession();
  const [isReady, setReady] = useState(false);

  useClickOutside([siderRef, siderFloatButtonRef], () => (screens.md ? null : setCollapsed(true)));

  const styles: any = {
    sider: {
      position: screens.md ? 'static' : 'fixed',
      top: 0,
      left: isCollapsed ? '-100%' : 0,
      height: screens.md ? 'auto' : '100%',
      borderRight: `1px solid ${isLight ? 'var(--color-gray-300)' : 'var(--color-gray-700)'}`,
      background: isLight ? 'var(--color-white)' : 'var(--color-rich-black)',
      zIndex: 100,
    },
    menuWrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '32px 16px',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
    },
    layout: {
      background: isLight ? 'var(--color-white)' : 'var(--color-rich-black)',
      border: `1px solid ${isLight ? 'var(--color-gray-300)' : 'var(--color-gray-700)'}`,
      borderRadius: 16,
      overflow: 'hidden',
      height: screens.md ? 'max(75vh, 600px)' : '100%',
    },
    content: {
      padding: '32px 16px',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
    },
  };

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <React.Fragment>
      <Layout
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '32px 16px',
          background: 'transparent',
        }}
      >
        <div className="container max-w-6xl mx-auto">
          <Layout style={styles.layout}>
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
                className="[&_.ant-menu]:!bg-transparent [&_.ant-menu]:!border-none designed_scrollbar"
              >
                {isReady &&
                  ((isCollapsed && screens.md) || (
                    <div className="text-center space-y-2">
                      <div className="bg-gray-300 rounded-full w-28 h-28 mx-auto flex items-center justify-center">
                        <Image
                          src={Toolbox.generateCharacterSvg({ character: user?.name, type: 'url' })}
                          alt={user?.name}
                          width={80}
                          height={80}
                        />
                      </div>
                      <p className="text-lg font-medium text-[var(--color-primary)]">{user?.name}</p>
                    </div>
                  ))}
                {(isCollapsed && screens.md) || <ThemeToggler className="place-self-center" />}
                <UserMenu
                  className="mt-4"
                  selectedKeys={[pathname]}
                  openKeys={menu?.openMenuKeys}
                  onOpenChange={(keys) => setMenu({ openMenuKeys: keys })}
                />
              </div>
            </Layout.Sider>
            <Layout.Content style={styles.content} className="designed_scrollbar">
              {children}
            </Layout.Content>
          </Layout>
        </div>
      </Layout>
      <FloatButton ref={siderFloatButtonRef} icon={<CgMenuGridO />} onClick={() => setCollapsed((prev) => !prev)} />
    </React.Fragment>
  );
};

export default UserLayout;
