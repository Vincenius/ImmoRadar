import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import "@/styles/globals.css";

import { GoogleAdSense } from "next-google-adsense";
import { createTheme, MantineProvider, TagsInput, TextInput, Select } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

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

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme}>
      <GoogleAdSense publisherId="pub-1087144186006114" />
      <Notifications />
      <Component {...pageProps} />
    </MantineProvider>
  );
}