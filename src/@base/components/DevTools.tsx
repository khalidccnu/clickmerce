import useDevToolsStatus from '@lib/hooks/useDevToolsStatus';
import { useEffect } from 'react';

interface IProps {
  showWarning?: boolean;
}

const DevTools: React.FC<IProps> = ({ showWarning = false }) => {
  const isDevToolsOpen = useDevToolsStatus();

  useEffect(() => {
    const disableInspect = (e) => e.preventDefault();
    const disableTextSelection = (e) => {
      e.preventDefault();
      return false;
    };

    document.body.style.userSelect = 'none';
    window.addEventListener('contextmenu', disableInspect);
    document.addEventListener('selectstart', disableTextSelection);
    document.addEventListener('dragstart', disableTextSelection);
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && ['a', 'A', 'c', 'C', 'v', 'V'].includes(e.key)) e.preventDefault();
      if (e.ctrlKey && e.shiftKey && e.key === 'J') e.preventDefault();
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J'))) e.preventDefault();
    });

    return () => {
      document.body.style.userSelect = 'auto';
      window.removeEventListener('contextmenu', disableInspect);
      document.removeEventListener('selectstart', disableTextSelection);
      document.removeEventListener('dragstart', disableTextSelection);
      window.removeEventListener('keydown', disableInspect);
    };
  }, []);

  return (
    isDevToolsOpen &&
    showWarning && (
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="mx-4 max-w-md rounded-lg border border-white/20 bg-white/10 p-8 text-center backdrop-blur-sm space-y-4">
          <p className="text-2xl font-bold">Developer Tools Detected</p>
          <p className="leading-relaxed text-slate-300">
            For security reasons, developer tools are not allowed (Please close the developer tools to continue).
          </p>
        </div>
      </div>
    )
  );
};

export default DevTools;
