import { TId } from '@base/interfaces';
import { createContext, useContext } from 'react';

const PosInvContext = createContext<{ invId: TId }>(null);

export const usePosInv = () => {
  const context = useContext(PosInvContext);

  if (!context) throw new Error('usePosInv must be used within PosInv Provider');
  return context;
};

export default PosInvContext;
