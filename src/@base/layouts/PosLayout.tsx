import BrandLogo from '@base/components/BrandLogo';
import CustomLink from '@base/components/CustomLink';
import { Paths } from '@lib/constant/paths';
import { useClickOutside } from '@lib/hooks/useClickOutside';
import useFullScreen from '@lib/hooks/useFullScreen';
import useRealTimeClock from '@lib/hooks/useRealTimeClock';
import useResize from '@lib/hooks/useResize';
import useTheme from '@lib/hooks/useTheme';
import { Button, FloatButton, Grid, Layout, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import React, { type PropsWithChildren, useRef, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdDashboard, MdFullscreen, MdFullscreenExit, MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';

interface IProps extends PropsWithChildren {}

const PosLayout: React.FC<IProps> = ({ children }) => {
  const router = useRouter();
  const screens = Grid.useBreakpoint();
  const [isCollapsed, setCollapsed] = useState(false);
  const { elemRef: siderRef, width: siderWidth } = useResize<HTMLDivElement>();
  const siderFloatButtonRef = useRef(null);
  const { isLight } = useTheme();
  const { isFullScreen, toggleFullScreenFn } = useFullScreen();
  const { time } = useRealTimeClock({ format: '12h', includeSeconds: true });

  useClickOutside([siderRef, siderFloatButtonRef], () => (screens.md ? null : setCollapsed(true)));

  const styles: any = {
    sider: {
      position: 'fixed',
      top: 0,
      right: isCollapsed ? '-100%' : 0,
      height: '100vh',
      borderLeft: screens.md ? 'none' : '1px solid var(--color-gray-200)',
      background: isLight ? 'var(--color-white)' : 'var(--color-rich-black)',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 100,
    },
    siderWrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      paddingBlock: 16,
      overflowY: 'auto',
    },
    layout: {
      paddingRight: !screens.md || isCollapsed ? 0 : siderWidth,
      background: 'transparent',
    },
    header: {
      position: 'sticky',
      top: 0,
      right: 0,
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
        <div style={styles.siderWrapper} className="designed_scrollbar overscroll-contain"></div>
      </Layout.Sider>
      <Layout style={styles.layout}>
        <Layout.Header style={styles.header}>
          <CustomLink href={Paths.root}>
            <BrandLogo width={screens.md ? 220 : 160} />
          </CustomLink>
          {screens.lg && (
            <Tag color="purple">
              <FaClock className="inline-block -mt-0.5" /> {time}
            </Tag>
          )}
          <Button
            className="ml-auto"
            type="primary"
            icon={<MdDashboard />}
            onClick={() => router.push(Paths.admin.root)}
          >
            {screens.md && 'Dashboard'}
          </Button>
          <Button
            type="primary"
            icon={isFullScreen ? <MdFullscreenExit /> : <MdFullscreen />}
            onClick={toggleFullScreenFn}
            ghost
          />
          <Button type="text" size="large" onClick={() => setCollapsed((prev) => !prev)}>
            <MdOutlineKeyboardDoubleArrowRight size={24} className={isCollapsed ? 'rotate-180' : 'rotate-0'} />
          </Button>
        </Layout.Header>
        <Layout.Content>
          <div className="md:h-full container py-4">{children}</div>
        </Layout.Content>
      </Layout>
      <FloatButton
        ref={siderFloatButtonRef}
        style={{
          display: screens.md || isCollapsed ? 'none' : 'block',
          left: 16,
        }}
        icon={<IoClose />}
        onClick={() => setCollapsed((prev) => !prev)}
      />
    </Layout>
  );
};

export default PosLayout;
