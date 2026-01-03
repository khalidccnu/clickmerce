export const Env = {
  // Base
  webTitle: process.env.NEXT_PUBLIC_WEB_TITLE,
  webTitleInitial: process.env.NEXT_PUBLIC_WEB_TITLE_INITIAL,
  webDescription: process.env.NEXT_PUBLIC_WEB_DESCRIPTION,
  webBrandIcon: process.env.NEXT_PUBLIC_WEB_BRAND_ICON,
  webBrandLogo: process.env.NEXT_PUBLIC_WEB_BRAND_LOGO,
  webPhoneCode: process.env.NEXT_PUBLIC_WEB_PHONE_CODE,
  webCurrency: process.env.NEXT_PUBLIC_WEB_CURRENCY,

  // Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  supabaseProjectRef: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAccessToken: process.env.SUPABASE_ACCESS_TOKEN,
  supabasePublishableOrAnonKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY,
  supabaseServiceRoleKey: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,
  webHostUrl: process.env.NEXT_PUBLIC_WEB_HOST_URL,
  webIdentifier: process.env.NEXT_PUBLIC_WEB_IDENTIFIER,
  webMode: process.env.NEXT_PUBLIC_WEB_MODE,

  // Flag
  isDevelopment: process.env.NEXT_PUBLIC_WEB_MODE === 'development',
  isStaging: process.env.NEXT_PUBLIC_WEB_MODE === 'staging',
  isProduction: process.env.NEXT_PUBLIC_WEB_MODE === 'production',
  isEnableRBAC: process.env.NEXT_PUBLIC_ENABLE_RBAC,
};
