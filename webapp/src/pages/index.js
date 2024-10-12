import { Flex, Text, Group, ThemeIcon, Title, Box, Card } from '@mantine/core';
import { IconArrowMergeBoth, IconList, IconBell, IconArrowUp } from '@tabler/icons-react';
import { fetcher } from '@/utils/fetcher'
import Layout from '@/components/Layout/Layout'
import Logos from '@/components/Logos/Logos'
import SearchBar from '@/components/SearchBar/SearchBar';
import FeatureCards from '@/components/FeatureCards/FeatureCards';
import SearchPages from '@/components/SearchPages/SearchPages';
import FAQs from '@/components/FAQ/FAQ';
import styles from '@/styles/Home.module.css'
import { Button } from '@mantine/core';
import { mainSearches } from '@/utils/searchSeo'

export default function Home() {
  return (
    <Layout
      title="ImmoRadar | Alle Immobilienangebote an einem Ort"
      description="Kein mühsames Durchsuchen mehrerer Webseiten. Eine gut sortierte Liste ohne Duplikate und sofortige Updates bei neuen Angeboten."
    >
      <Box className={styles.header}>
        <div className={styles.background}></div>

        <Flex mih="600px" h="calc(100vh - 70px - 64px)" direction="column" justify="space-evenly">
          <Box>
            <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 72 }} fw="bold" mb="lg" textWrap="balance">
              Alle <span className={styles.gradientText}>Immobilienangebote</span> an einem Ort
            </Title>

            <Group position="center">
              <SearchBar showFilter={true} />
            </Group>
          </Box>
          <Flex justify="space-between" align={{ base: 'left', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={{ base: 'xl', sm: 'xl'}} maw={{ base: "350px", sm: "100%"}} m="0 auto">
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconArrowMergeBoth size={24} /></ThemeIcon>
              <Text ta={{ base: 'left', sm: 'center'}}>Kombiniert Ergebnisse von <b>10 Immobilien-Webseiten</b></Text>
            </Flex>
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconList size={24} /></ThemeIcon>
              <Text ta={{ base: 'left', sm: 'center'}}>Eine einzige, gut sortierte Liste <b>ohne Duplikate</b></Text>
            </Flex>
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconBell size={24} /></ThemeIcon>
              <Text ta={{ base: 'left', sm: 'center'}}><b>Benachrichtigungen</b> bei neuen Angeboten</Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      <Logos />

      <Box my="6em">
        <FeatureCards />
      </Box>

      <FAQs />

      <Box my="6em">
        <Title order={2} fz={36} fw={700} mb="lg" ta="center">Finde Wohnungen in deiner Region</Title>

        <SearchPages data={mainSearches} />
      </Box>

      <Box my="6em">
        <Button
          variant="filled"
          color="cyan.9"
          size="lg"
          fullWidth
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          JETZT SUCHEN
          <IconArrowUp size={20} ml="sm"/>
        </Button>
      </Box>
    </Layout>
  );
}
