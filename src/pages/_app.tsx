import { Env } from '.environments';
import WithLayout from '@base/layouts/WithLayout';
import { Providers } from '@lib/providers';
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

const App = ({
  router,
  Component,
  pageProps: { settingsIdentity, settingsTrackingCodes, pages, ...restPageProps },
}: AppProps) => {
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
      <WithLayout
        pathname={router.pathname}
        settingsIdentity={settingsIdentity}
        settingsTrackingCodes={settingsTrackingCodes}
        pages={pages}
      >
        <Component
          settingsIdentity={settingsIdentity}
          settingsTrackingCodes={settingsTrackingCodes}
          pages={pages}
          {...restPageProps}
        />
      </WithLayout>
    </Providers>
  );
};

export default App;
