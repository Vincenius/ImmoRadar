import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import "@/styles/globals.css";

import { createTheme, MantineProvider, TagsInput, TextInput, Select } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { SessionProvider } from "next-auth/react"

const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: 8,
  components: {
    TagsInput: TagsInput.extend({
      styles: {
        description: { color: '#696969' },
      },
    }),
    TextInput: TextInput.extend({
      styles: {
        required: { color: '#c92a2a' },
      }
    }),
    Select: Select.extend({
      styles: {
        required: { color: '#c92a2a' },
      }
    })
  },
});

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <MantineProvider theme={theme} forceColorScheme="light">
        <Notifications />
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
}