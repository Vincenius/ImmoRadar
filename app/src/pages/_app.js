import { SessionProvider } from "next-auth/react"
import '@mantine/core/styles.css';
import "@/styles/globals.css";

import { createTheme, MantineProvider, TagsInput, TextInput, Select } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'cyan',
  primaryShade: 9,
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
export default function App({ Component,  pageProps: { session, ...pageProps },}) {
  return (
    <SessionProvider session={session}>
      <MantineProvider theme={theme}>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
}