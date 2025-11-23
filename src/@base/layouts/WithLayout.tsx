import { IBasePageProps } from '@base/interfaces';
import { AuthPaths, UserPaths } from '@lib/constant/authPaths';
import { Paths } from '@lib/constant/paths';
import SettingsIdentityContext from '@lib/context/SettingsIdentityContext';
import AnalyticsProvider from '@lib/providers/AnalyticsProvider';
import { initializeRedux, persistor } from '@lib/redux/store';
import { Toolbox } from '@lib/utils/toolbox';
import React, { type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AdminLayout from './AdminLayout';
import LandingLayout from './LandingLayout';
import PosLayout from './PosLayout';
import UserLayout from './UserLayout';

interface IProps extends PropsWithChildren<IBasePageProps> {
  pathname: string;
}

const WithLayout: React.FC<IProps> = ({ pathname, settingsIdentity, settingsTrackingCodes, pages, children }) => {
  const { store } = initializeRedux();

  if (pathname === Paths.admin.pos) {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <PosLayout>{children}</PosLayout>
        </PersistGate>
      </Provider>
    );
  }

  if (Toolbox.isDynamicPath(AuthPaths, pathname)) {
    if (Toolbox.isDynamicPath(UserPaths, pathname)) {
      return <UserLayout>{children}</UserLayout>;
    }

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AdminLayout>{children}</AdminLayout>
        </PersistGate>
      </Provider>
    );
  }

  if ([Paths.initiate, Paths.auth.signIn].includes(pathname)) {
    return children;
  }

  return (
    <SettingsIdentityContext.Provider value={{ settingsIdentity, settingsTrackingCodes, pages }}>
      <AnalyticsProvider
        gtmId={settingsTrackingCodes?.gtm_id}
        gtagId={settingsTrackingCodes?.gtag_id}
        fbPixelId={settingsTrackingCodes?.fb_pixel_id}
      >
        <LandingLayout>{children}</LandingLayout>
      </AnalyticsProvider>
    </SettingsIdentityContext.Provider>
  );
};

export default WithLayout;
