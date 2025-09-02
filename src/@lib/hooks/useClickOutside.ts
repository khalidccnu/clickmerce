import { RefObject, useCallback, useEffect } from 'react';

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  refs: RefObject<T>[],
  callback: (event: MouseEvent | TouchEvent) => void,
  isEnabled: boolean = true,
): void => {
  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    if (!isEnabled) return;

    const listener = (event: MouseEvent | TouchEvent): void => {
      if (!event.target || !(event.target instanceof Node)) {
        return;
      }

      const isClickInside = refs.some((ref) => {
        return ref.current && ref.current.contains(event.target as Node);
      });

      if (!isClickInside) {
        memoizedCallback(event);
      }
    };

    document.addEventListener('mousedown', listener, { passive: true });
    document.addEventListener('touchstart', listener, { passive: true });

    return (): void => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [isEnabled, refs, memoizedCallback]);
};
