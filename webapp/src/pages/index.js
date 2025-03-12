
import { Box, Flex, Select, Text, Title, Group, ThemeIcon } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconClock, IconArrowMergeBoth, IconList } from '@tabler/icons-react'
import Layout from '@/components/Layout/Layout'
import SearchBar from '@/components/SearchBar/SearchBar';
import Logos from '@/components/Logos/Logos'
import styles from '@/styles/Home.module.css'

export default function Search () {
  return (<Layout
    title="Einfach Finden. Alle Grundstücke an einem Ort. | Fertighaus Radar"
    description="Ihre Suchmaschine für Grundstücke. Kombiniert Ergebnisse von den Top 3 Immobilien-Portalen und zeigt eine einzige, gut sortierte Liste ohne Duplikate.."
  >
    <Box>
      <div className={styles.background}></div>

      <Flex py="6rem" mih="calc(100vh - 64px - 52px - 16px)" h="100%" direction="column" justify="space-evenly">
        <Box mb="xl">
          <Title order={1} ta={{ base: 'center', sm: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 72 }} fw="bold" textWrap="balance">
            Einfach <span className={styles.gradientText}>Finden.</span><br/>
          </Title>
          <Title order={2} fz={{ base: 24, xs: 32, sm: 40, md: 48 }} ta={{ base: 'center', sm: 'left' }} mb="xl" fw={300}>
            Alle Grundstücke an einem Ort.
          </Title>

          <Group position="center">
            <SearchBar showFilter={true} />
          </Group>
        </Box>
        <Flex align={{ base: 'left' }} direction={{ base: 'column', sm: 'row' }} gap={{ base: 'xl' }} maw={{ base: "350px", sm: "100%"}}>
          <Flex align={{ base: 'left'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
            <ThemeIcon radius="sm" size="lg" variant="filled"><IconArrowMergeBoth size={24} /></ThemeIcon>
            <Text ta={{ base: 'left' }}>Kombiniert Ergebnisse von den Top <b>3 Immobilien-Portalen</b></Text>
          </Flex>
          <Flex align={{ base: 'left' }} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
            <ThemeIcon radius="sm" size="lg" variant="filled"><IconList size={24} /></ThemeIcon>
            <Text ta={{ base: 'left' }}>Eine einzige, gut sortierte Liste <b>ohne Duplikate</b></Text>
          </Flex>
          <Flex align={{ base: 'left' }} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
            <ThemeIcon radius="sm" size="lg" variant="filled"><IconClock size={24} /></ThemeIcon>
            <Text ta={{ base: 'left' }}><b>Mehr Zeit</b> für die wesentlichen Dinge</Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
    <Logos />
  </Layout>)
}
