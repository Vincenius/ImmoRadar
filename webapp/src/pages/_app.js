import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import "@/styles/globals.css";

import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
  primaryColor: 'cyan',
});

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme}>
       <Notifications />
      <Component {...pageProps} />
    </MantineProvider>
  );
}