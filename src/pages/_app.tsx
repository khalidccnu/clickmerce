import { Env } from '.environments';
import AdminLayout from '@base/layouts/AdminLayout';
import { AuthPaths } from '@lib/constant/authPaths';
import { Providers } from '@lib/context';
import { Toolbox } from '@lib/utils/toolbox';
import '@styles/index.scss';
import type { AppProps } from 'next/app';
import { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { Roboto } from 'next/font/google';
import Head from 'next/head';
import NextNProgress from 'nextjs-progressbar';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

const App = ({ router, Component, pageProps }: AppProps) => {
  const fontWithMorePropsCreateFn = (fontDefinition: NextFontWithVariable, originalVariableName: string) => {
    return { ...fontDefinition, originalVariableName };
  };

  const robotoFont = fontWithMorePropsCreateFn(roboto, '--font-roboto');

  return (
    <Providers nextFont={[robotoFont]}>
      <NextNProgress color="var(--color-primary)" height={3} options={{ showSpinner: false }} />
      <Head>
        <title>{Env.webTitle}</title>
        <meta name="description" content={Env.webDescription} />
      </Head>
      {Toolbox.isDynamicPath(AuthPaths, router.pathname) ? (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </Providers>
  );
};

export default App;
