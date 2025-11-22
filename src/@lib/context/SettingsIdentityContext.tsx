import { IBasePageProps } from '@base/interfaces';
import { createContext, useContext } from 'react';

const SettingsIdentityContext = createContext<IBasePageProps>(null);

export const useSettingsIdentity = () => {
  const context = useContext(SettingsIdentityContext);

  if (!context) throw new Error('useSettingsIdentity must be used within SettingsIdentity Provider');
  return context;
};

export default SettingsIdentityContext;
