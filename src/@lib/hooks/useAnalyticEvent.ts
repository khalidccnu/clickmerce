import { Analytic_Events, TAnalyticEventName } from '@lib/constant/analyticEvents';

export const useAnalyticEvent = () => {
  const sendEventFn = ({ name, data = {} }: { name: TAnalyticEventName; data?: Record<string, any> }) => {
    if (typeof window === 'undefined') return;

    const isReserved = name in Analytic_Events;
    const gtagName = isReserved ? Analytic_Events[name].google : name;
    const fbName = isReserved ? Analytic_Events[name].facebook : name;

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: gtagName,
        ...data,
      });
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', gtagName, data);
    }

    if (typeof window.fbq === 'function') {
      const method = isReserved ? 'track' : 'trackCustom';
      window.fbq(method, fbName, data);
    }
  };

  return { sendEventFn };
};
