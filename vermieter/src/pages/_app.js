import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import "@/styles/globals.css";

import { createTheme, MantineProvider, TagsInput, TextInput, Select } from '@mantine/core';

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

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme} forceColorScheme="light">
      <Component {...pageProps} />
    </MantineProvider>
  );
}