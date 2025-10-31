import 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    req?: NextApiRequest | NextRequest;
  }
}
