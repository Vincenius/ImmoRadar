import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import "@/styles/globals.css";

import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { TagsInput } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'cyan',
  components: {
    TagsInput: TagsInput.extend({
      styles: {
        description: { color: '#696969' },
      },
    }),
  },
});

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <Component {...pageProps} />
    </MantineProvider>
  );
}