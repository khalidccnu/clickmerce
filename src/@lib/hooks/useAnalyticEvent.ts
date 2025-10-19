import { Analytic_Events, TAnalyticEventName } from '@lib/constant/analyticEvents';

export const useAnalyticEvent = () => {
  const sendEventFn = ({ name, data = {} }: { name: TAnalyticEventName; data?: Record<string, any> }) => {
    const isReserved = name in Analytic_Events;
    const gtagName = isReserved ? Analytic_Events[name].google : name;
    const fbName = isReserved ? Analytic_Events[name].facebook : name;

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', gtagName, data);
    }

    if (typeof window !== 'undefined' && window.fbq) {
      const fbq = window.fbq;
      const method = isReserved ? 'track' : 'trackCustom';

      fbq(method, fbName, data);
    }
  };

  return { sendEventFn };
};
