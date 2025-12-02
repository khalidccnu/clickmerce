import devtoolsDetect from 'devtools-detect';
import { useEffect, useState } from 'react';

const useDevToolsStatus = () => {
  const [isDevToolsOpen, setDevToolsOpen] = useState(devtoolsDetect.isOpen);

  const handleChangeFn = (event) => {
    setDevToolsOpen(event.detail.isOpen);
  };

  useEffect(() => {
    window.addEventListener('devtoolschange', handleChangeFn);

    return () => {
      window.removeEventListener('devtoolschange', handleChangeFn);
    };
  }, []);

  return isDevToolsOpen;
};

export default useDevToolsStatus;
