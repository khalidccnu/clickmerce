import { Analytic_Events } from '@lib/constant/analyticEvents';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { PropsWithChildren, useEffect } from 'react';

interface IProps extends PropsWithChildren {
  gtmId?: string;
  gtagId?: string;
  fbPixelId?: string;
}

const AnalyticsProvider: React.FC<IProps> = ({ gtmId, gtagId, fbPixelId, children }) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRouteChangeFn = (url: string) => {
      if (gtmId && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: Analytic_Events.page_view.google,
          page_path: url,
          page_location: window.location.href,
        });
      }

      if (gtagId && typeof window.gtag === 'function') {
        window.gtag('event', Analytic_Events.page_view.google, {
          page_path: url,
          page_location: window.location.href,
        });
      }

      if (fbPixelId && typeof window.fbq === 'function') {
        window.fbq('track', Analytic_Events.page_view.facebook);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChangeFn);
    return () => router.events.off('routeChangeComplete', handleRouteChangeFn);
  }, [router.events, gtmId, gtagId, fbPixelId]);

  return (
    <>
      {children}
      {gtmId && (
        <>
          <Script id="gtm-script" strategy="afterInteractive">
            {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
          </Script>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        </>
      )}
      {gtagId && !gtmId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtagId}', { send_page_view: false });
          `}
          </Script>
        </>
      )}
      {fbPixelId && (
        <>
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
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1" />`,
            }}
          />
        </>
      )}
    </>
  );
};

export default AnalyticsProvider;
