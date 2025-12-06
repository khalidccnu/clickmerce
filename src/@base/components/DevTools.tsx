import useDevToolsStatus from '@lib/hooks/useDevToolsStatus';
import { useEffect } from 'react';

interface IProps {
  showWarning?: boolean;
  disableRightClick?: boolean;
  disableTextSelection?: boolean;
  disableDragStart?: boolean;
  disableCopy?: boolean;
  disableCut?: boolean;
  disablePaste?: boolean;
  disableSelectAll?: boolean;
  disableInspect?: boolean;
}

const DevTools: React.FC<IProps> = ({
  showWarning = true,
  disableRightClick = true,
  disableTextSelection = true,
  disableDragStart = true,
  disableCopy = true,
  disableCut = true,
  disablePaste = true,
  disableSelectAll = true,
  disableInspect = true,
}) => {
  const isDevToolsOpen = useDevToolsStatus();

  useEffect(() => {
    const disableInspectHandler = (e) => e.preventDefault();

    const disableTextSelectionHandler = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeydown = (e) => {
      if (disableCopy && e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
      }

      if (disableCut && e.ctrlKey && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
      }

      if (disablePaste && e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
      }

      if (disableSelectAll && e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
      }

      if (disableInspect) {
        if (e.key === 'F12') {
          e.preventDefault();
        }

        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) {
          e.preventDefault();
        }
      }
    };

    if (disableTextSelection) {
      document.body.style.userSelect = 'none';
    }

    if (disableRightClick) {
      window.addEventListener('contextmenu', disableInspectHandler);
    }

    if (disableTextSelection) {
      document.addEventListener('selectstart', disableTextSelectionHandler);
    }

    if (disableDragStart) {
      document.addEventListener('dragstart', disableTextSelectionHandler);
    }

    window.addEventListener('keydown', handleKeydown);

    return () => {
      if (disableTextSelection) {
        document.body.style.userSelect = 'auto';
      }

      if (disableRightClick) {
        window.removeEventListener('contextmenu', disableInspectHandler);
      }

      if (disableTextSelection) {
        document.removeEventListener('selectstart', disableTextSelectionHandler);
      }

      if (disableDragStart) {
        document.removeEventListener('dragstart', disableTextSelectionHandler);
      }

      window.removeEventListener('keydown', handleKeydown);
    };
  }, [
    disableRightClick,
    disableTextSelection,
    disableDragStart,
    disableCopy,
    disableCut,
    disablePaste,
    disableSelectAll,
    disableInspect,
  ]);

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
