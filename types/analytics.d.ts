interface Gtag {
  (command: 'config', targetId: string, config?: Record<string, any>): void;
  (command: 'event', eventName: string, eventParams?: Record<string, any>): void;
  (command: 'event', eventName: 'purchase', eventParams: Record<string, any>): void;
  (command: 'js', date: Date): void;
  (command: 'set', config: { [key: string]: any }): void;
  (command: 'set', targetId: string, config: { [key: string]: any }): void;
  (command: 'get', targetId: string, fieldName: string, callback: (value: any) => void): void;
  (command: 'consent', consentAction: 'default' | 'update', consentParams: { [key: string]: any }): void;
  (command: 'config' | 'event' | 'js' | 'set' | 'get' | 'consent', ...args: any[]): void;
}

interface Fbq {
  (command: 'init', pixelId: string, userData?: Record<string, any>): void;
  (command: 'track', eventName: 'PageView'): void;
  (command: 'track', eventName: 'Purchase', params: Record<string, any>): void;
  (
    command: 'track',
    eventName:
      | 'AddToCart'
      | 'InitiateCheckout'
      | 'ViewContent'
      | 'Search'
      | 'Contact'
      | 'CompleteRegistration'
      | 'Lead',
    params?: Record<string, any>,
  ): void;
  (command: 'trackSingle', pixelId: string, eventName: string, params?: Record<string, any>): void;
  (command: 'trackCustom', eventName: string, params?: Record<string, any>): void;
  (command: 'trackSingleCustom', pixelId: string, eventName: string, params?: Record<string, any>): void;
  (command: 'consent', action: 'grant' | 'revoke'): void;
  (command: 'dataProcessingOptions', options: string[], country?: number, state?: number): void;
  (
    command:
      | 'init'
      | 'track'
      | 'trackSingle'
      | 'trackCustom'
      | 'trackSingleCustom'
      | 'consent'
      | 'revoke'
      | 'dataProcessingOptions',
    ...args: any[]
  ): void;
  push: (args: any[]) => void;
  loaded: boolean;
  version: string;
  queue: any[];
}

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
    _fbq?: Fbq;
    dataLayer?: Array<{ [key: string]: any }>;
    ga?: (...args: any[]) => void;
    gtm?: {
      start?: number;
      [key: string]: any;
    };
    analyticsQueue?: Array<() => void>;
  }
}

export {};
