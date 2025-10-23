export type TAnalyticEventReservedKey = keyof typeof Analytic_Events;
export type TAnalyticEventName = string | TAnalyticEventReservedKey;

export const Analytic_Events = {
  login: { google: 'login', facebook: 'Login' },
  sign_up: { google: 'sign_up', facebook: 'CompleteRegistration' },
  lead: { google: 'generate_lead', facebook: 'Lead' },
  view_item: { google: 'view_item', facebook: 'ViewContent' },
  add_to_cart: { google: 'add_to_cart', facebook: 'AddToCart' },
  initiate_checkout: { google: 'begin_checkout', facebook: 'InitiateCheckout' },
  purchase: { google: 'purchase', facebook: 'Purchase' },
  search: { google: 'search', facebook: 'Search' },
  page_view: { google: 'page_view', facebook: 'PageView' },
} as const;
