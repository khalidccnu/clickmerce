import { States } from '@lib/constant/states';
import useResize from '@lib/hooks/useResize';
import useSessionState from '@lib/hooks/useSessionState';
import { useRouter } from 'next/router';
import React, { type PropsWithChildren, useEffect, useState } from 'react';
import LandingFooter from './elements/LandingFooter';
import LandingHeader from './elements/LandingHeader';

interface IProps extends PropsWithChildren {}

const LandingLayout: React.FC<IProps> = ({ children }) => {
  const router = useRouter();
  const { elemRef: headerRef, height: headerHeight } = useResize();
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [_, setHeaderHeight] = useSessionState(States.landingHeaderHeight);

  const handleScrollFn = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 200) {
      if (prevScrollY > currentScrollY) {
        headerRef.current.style.transform = 'translateY(0)';
        headerRef.current.classList.add('shadow-lg');
      } else {
        headerRef.current.style.transform = `translateY(-${headerRef.current.offsetHeight}px)`;
      }

      setPrevScrollY(currentScrollY);
    } else {
      headerRef.current.style.transform = 'translateY(0)';
      headerRef.current.classList.remove('shadow-lg');
      setPrevScrollY(0);
    }
  };

  useEffect(() => {
    if (headerHeight) setHeaderHeight(headerHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerHeight]);

  useEffect(() => {
    window.addEventListener('scroll', handleScrollFn);
    return () => window.removeEventListener('scroll', handleScrollFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevScrollY]);

  useEffect(() => {
    router.events.on('routeChangeStart', handleScrollFn);
    return () => router.events.off('routeChangeStart', handleScrollFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <React.Fragment>
      <LandingHeader
        ref={headerRef}
        className="sticky top-0 left-0 w-full z-50 py-3 bg-blue-50/90 backdrop-blur-xl transition-transform duration-500"
      />
      <div className="relative bg-sky-50 z-10">{children}</div>
      <LandingFooter />
    </React.Fragment>
  );
};

export default LandingLayout;
