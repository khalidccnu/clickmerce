import { DayjsConfig } from '@lib/config/dayjs';
import { queryClient } from '@lib/config/reactQuery';
import useTheme from '@lib/hooks/useTheme';
import { initializeRedux, persistor } from '@lib/redux/store';
import { setNotificationInstance } from '@lib/utils/notificationInstance';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ThemeConfig } from 'antd';
import { ConfigProvider, notification, theme as themeConfig } from 'antd';
import { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { useEffect, type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

type TProps = {
  nextFont: (NextFontWithVariable & { originalVariableName: string })[];
} & PropsWithChildren;

export const Providers = ({ nextFont, children }: TProps) => {
  const { isLight } = useTheme();
  const [notificationApi, notificationHolder] = notification.useNotification();
  const { store } = initializeRedux();

  DayjsConfig();

  const theme: ThemeConfig = {
    algorithm: isLight ? themeConfig.defaultAlgorithm : themeConfig.darkAlgorithm,
    token: {
      fontFamily: nextFont.map((font) => `var(${font.originalVariableName})`).join(', '),
      fontSize: 16,
      colorPrimary: '#6e2914',
      colorPrimaryActive: '#5a2110',
      colorPrimaryBorder: '#6e2914',
      colorPrimaryHover: '#5a2110',
      colorLinkActive: '#5a2110',
      colorLinkHover: '#5a2110',
      screenXSMax: 639,
      screenSMMin: 640,
      screenSM: 640,
      screenMDMax: 1023,
      screenLGMin: 1024,
      screenLG: 1024,
      screenLGMax: 1279,
      screenXLMin: 1280,
      screenXL: 1280,
      screenXLMax: 1535,
      screenXXLMin: 1536,
      screenXXL: 1536,
    },
  };

  useEffect(() => {
    setNotificationInstance(notificationApi);
  }, [notificationApi]);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConfigProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <main
              role="main"
              id="__main"
              className={[...nextFont.map((font) => font.variable), 'font-roboto'].join(' ')}
            >
              {notificationHolder} {children}
            </main>
          </QueryClientProvider>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
};
