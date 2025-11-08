import { AuthPaths } from '@lib/constant/authPaths';
import { Paths } from '@lib/constant/paths';
import SettingsIdentityContext from '@lib/context/SettingsIdentityContext';
import { initializeRedux, persistor } from '@lib/redux/store';
import { Toolbox } from '@lib/utils/toolbox';
import { IPage } from '@modules/pages/lib/interfaces';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import React, { type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AdminLayout from './AdminLayout';
import LandingLayout from './LandingLayout';
import PosLayout from './PosLayout';

interface IProps extends PropsWithChildren {
  pathname: string;
  settingsIdentity: ISettingsIdentity;
  pages: IPage[];
}

const WithLayout: React.FC<IProps> = ({ pathname, settingsIdentity, pages, children }) => {
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
    <SettingsIdentityContext.Provider value={{ settingsIdentity, pages }}>
      <LandingLayout>{children}</LandingLayout>
    </SettingsIdentityContext.Provider>
  );
};

export default WithLayout;
