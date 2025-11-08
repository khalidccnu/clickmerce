import { IPage } from '@modules/pages/lib/interfaces';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { createContext, useContext } from 'react';

const SettingsIdentityContext = createContext<{ settingsIdentity: ISettingsIdentity; pages: IPage[] }>(null);

export const useSettingsIdentity = () => {
  const context = useContext(SettingsIdentityContext);

  if (!context) throw new Error('useSettingsIdentity must be used within SettingsIdentity Provider');
  return context;
};

export default SettingsIdentityContext;
