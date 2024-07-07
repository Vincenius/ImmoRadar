import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import "@/styles/globals.css";

import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'cyan',
});

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme}>
      <Component {...pageProps} />
    </MantineProvider>
  );
}