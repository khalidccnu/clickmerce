import { useCallback, useEffect, useState } from 'react';

const useFullScreen = (element?: HTMLElement) => {
  const [isClient, setClient] = useState(false);
  const [isFullScreen, setFullScreen] = useState(false);

  const isSupported =
    isClient &&
    !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );

  const targetElement = isClient ? element || document.documentElement : null;

  const enterFullScreenFn = useCallback(async (): Promise<void> => {
    if (!isClient || !isSupported || !targetElement) return;

    try {
      if (targetElement.requestFullscreen) {
        await targetElement.requestFullscreen();
      } else if (targetElement.webkitRequestFullscreen) {
        await targetElement.webkitRequestFullscreen();
      } else if (targetElement.mozRequestFullScreen) {
        await targetElement.mozRequestFullScreen();
      } else if (targetElement.msRequestFullscreen) {
        await targetElement.msRequestFullscreen();
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  }, [isClient, isSupported, targetElement]);

  const exitFullScreenFn = useCallback(async (): Promise<void> => {
    if (!isClient || !isSupported) return;

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  }, [isClient, isSupported]);

  const toggleFullScreenFn = useCallback(async (): Promise<void> => {
    if (isFullScreen) {
      await exitFullScreenFn();
    } else {
      await enterFullScreenFn();
    }
  }, [isFullScreen, enterFullScreenFn, exitFullScreenFn]);

  const checkFullScreenStatusFn = useCallback(() => {
    if (!isClient) return;

    const fullScreenElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    setFullScreen(!!fullScreenElement);
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !isSupported) return;

    const events = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];

    events.forEach((event) => {
      document.addEventListener(event, checkFullScreenStatusFn);
    });

    checkFullScreenStatusFn();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, checkFullScreenStatusFn);
      });
    };
  }, [isClient, isSupported, checkFullScreenStatusFn]);

  useEffect(() => {
    setClient(true);
  }, []);

  return {
    isFullScreen,
    enterFullScreenFn,
    exitFullScreenFn,
    toggleFullScreenFn,
    isSupported,
  };
};

export default useFullScreen;
