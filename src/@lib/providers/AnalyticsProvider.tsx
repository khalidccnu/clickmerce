import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { PropsWithChildren, useEffect } from 'react';

interface IProps extends PropsWithChildren {
  gtagId?: string;
  fbPixelId?: string;
}

const AnalyticsProvider: React.FC<IProps> = ({ gtagId, fbPixelId, children }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeFn = (url: string) => {
      if (gtagId && window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: url,
          page_location: window.location.href,
        });
      }

      if (fbPixelId && window.fbq) {
        window.fbq('track', 'PageView');
      }
    };

    router.events.on('routeChangeComplete', handleRouteChangeFn);
    return () => router.events.off('routeChangeComplete', handleRouteChangeFn);
  }, [router.events, gtagId, fbPixelId]);

  return (
    <React.Fragment>
      {children}
      {gtagId && (
        <React.Fragment>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtagId}', { send_page_view: false });
            `}
          </Script>
        </React.Fragment>
      )}
      {fbPixelId && (
        <Script id="fb-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </React.Fragment>
  );
};

export default AnalyticsProvider;
