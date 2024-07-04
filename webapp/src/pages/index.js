import { Flex, Text, Group, ThemeIcon, Title, Box, Autocomplete } from '@mantine/core';
import { IconClock, IconList, IconBell } from '@tabler/icons-react';
import Layout from '@/components/Layout/Layout'
import Logos from '@/components/Logos/Logos'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <Layout
      title="ImmoRadar | Alle Immobilienangebote an einem Ort"
      description="Kein mühsames Durchsuchen mehrerer Webseiten. Eine gut sortierte Liste ohne Duplikate und sofortige Updates bei neuen Angeboten."
    >
      <Box className={styles.header}>
        <div className={styles.background}></div>

        <Flex mih="600px" h="83vh" direction="column" justify="space-evenly">
          <Box>
            <Title order={1} align="left" size={72} fw="bold" mb="lg">
              Alle <span className={styles.gradientText}>Immobilienangebote</span> an einem Ort
            </Title>

            <Group position="center">
              <Autocomplete
                data={['Berlin', 'Hamburg']} // fetch from api -> include top 100 before fetching from api
                comboboxProps={{ shadow: 'md' }}
                limit={5}
                className={styles.input}
                placeholder="Ort / Stadt / Bezirk Suchen"
                size="lg"
                w="100%"
              />
            </Group>
          </Box>
            <Flex justify="space-between" align="center" direction={{ base: 'column', sm: 'row' }} gap={{ base: 'xl', sm: 'md'}}>
              <Flex align="center" direction="row" gap="sm">
                <ThemeIcon radius="xl" size="md" variant="filled"><IconList size={24} /></ThemeIcon>
                <Text>Eine einzige, gut sortierte Liste ohne Duplikate</Text>
              </Flex>
              <Flex align="center" direction="row" gap="sm">
                <ThemeIcon radius="xl" size="md" variant="filled"><IconBell size={24} /></ThemeIcon>
                <Text align="left">Benachrichtigungen bei neuen Angeboten</Text>
              </Flex>
              <Flex align="center" direction="row" gap="sm">
                <ThemeIcon radius="xl" size="md" variant="filled"><IconClock size={24} /></ThemeIcon>
                <Text align="left">Kein mühsames Durchsuchen mehrerer Webseiten</Text>
              </Flex>
            </Flex>
        </Flex>

        {/* <Flex mih="600px" direction="column" justify="center" gap="xl">
          <Box>
            <Title order={1} align="center" size={48} fw="normal">
              Alle Immobilienangebote an einem Ort
            </Title>
            <Flex justify="space-between" align="center" direction={{ base: 'column', sm: 'row' }} gap={{ base: 'xl', sm: 'md'}}>
              <Flex align="center" direction="row" gap="sm">
                <ThemeIcon radius="xl" size="md" variant="light"><IconList size={24} /></ThemeIcon>
                <Text>Eine einzige, gut sortierte Liste ohne Duplikate</Text>
              </Flex>
              <Flex align="center" direction="row" gap="sm">
                <ThemeIcon radius="xl" size="md" variant="light"><IconBell size={24} /></ThemeIcon>
                <Text align="center">Benachrichtigungen bei neuen Angeboten</Text>
              </Flex>
            </Flex>
          </Box>
          <Group position="center">
            <Input
              placeholder="Ort / Stadt / Bezirk Suchen"
              size="lg"
              w="100%"
            />
          </Group>
        </Flex> */}
      </Box>

      <Logos />

    </Layout>
  );
}
