import { Analytic_Events } from '@lib/constant/analyticEvents';
import { SettingsHooks } from '@modules/settings/lib/hooks';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { PropsWithChildren, useEffect } from 'react';

interface IProps extends PropsWithChildren {}

const AnalyticsProvider: React.FC<IProps> = ({ children }) => {
  const router = useRouter();

  const settingsQuery = SettingsHooks.useFind();
  const { tracking_codes } = settingsQuery.data?.data || {};

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRouteChangeFn = (url: string) => {
      if (tracking_codes?.gtm_id && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: Analytic_Events.page_view.google,
          page_path: url,
          page_location: window.location.href,
        });
      }

      if (tracking_codes?.gtag_id && typeof window.gtag === 'function') {
        window.gtag('event', Analytic_Events.page_view.google, {
          page_path: url,
          page_location: window.location.href,
        });
      }

      if (tracking_codes?.fb_pixel_id && typeof window.fbq === 'function') {
        window.fbq('track', Analytic_Events.page_view.facebook);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChangeFn);
    return () => router.events.off('routeChangeComplete', handleRouteChangeFn);
  }, [router.events, tracking_codes?.gtm_id, tracking_codes?.gtag_id, tracking_codes?.fb_pixel_id]);

  return (
    <>
      {children}
      {tracking_codes?.gtm_id && (
        <>
          <Script id="gtm-script" strategy="afterInteractive">
            {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${tracking_codes?.gtm_id}');
          `}
          </Script>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${tracking_codes?.gtm_id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        </>
      )}
      {tracking_codes?.gtag_id && !tracking_codes?.gtm_id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${tracking_codes?.gtag_id}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${tracking_codes?.gtag_id}', { send_page_view: false });
          `}
          </Script>
        </>
      )}
      {tracking_codes?.fb_pixel_id && (
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
            fbq('init', '${tracking_codes?.fb_pixel_id}');
            fbq('track', 'PageView');
          `}
          </Script>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${tracking_codes?.fb_pixel_id}&ev=PageView&noscript=1" />`,
            }}
          />
        </>
      )}
    </>
  );
};

export default AnalyticsProvider;
