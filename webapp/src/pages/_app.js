import "@/styles/globals.css";
import '@mantine/core/styles.css';

import { createTheme, MantineProvider, virtualColor } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'cyan',
  // colors: {
  //   primary: virtualColor({
  //     name: 'primary',
  //     dark: 'pink',
  //     light: 'cyan',
  //   }),
  // },
});

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme}>
      <Component {...pageProps} />
    </MantineProvider>
  );
}