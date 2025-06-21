import { Head, Html, Main, NextScript } from 'next/document';
import { ColorSchemeScript } from '@mantine/core';

export default function Document() {
  return (
    <Html lang="de">
      <Head>
        <ColorSchemeScript forceColorScheme="light" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}