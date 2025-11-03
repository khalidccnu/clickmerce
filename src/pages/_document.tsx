import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import type { DocumentContext } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

const MyDocument = () => {
  return (
    <Html lang="en">
      <Head>
        {/* <link key="favicon" rel="icon" href={Env.webBrandIcon} />
        <link key="favicon-shortcut" rel="shortcut icon" href={Env.webBrandIcon} /> */}
      </Head>
      <body className="bg-[var(--color-gray-50)] dark:bg-[var(--color-dark-gray)]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);

  return {
    ...initialProps,
    styles: (
      <React.Fragment>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </React.Fragment>
    ),
  };
};
