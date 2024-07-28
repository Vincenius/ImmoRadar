import { Flex, Text, Group, ThemeIcon, Title, Box, Accordion, Container, Card } from '@mantine/core';
import { IconClock, IconList, IconBell, IconArrowUp } from '@tabler/icons-react';
import Layout from '@/components/Layout/Layout'
import Logos from '@/components/Logos/Logos'
import SearchBar from '@/components/SearchBar/SearchBar';
import FeatureCards from '@/components/FeatureCards/FeatureCards';
import styles from '@/styles/Home.module.css'
import { Button } from '@mantine/core';

const faqs = [
  {
    question: 'Ist die Nutzung von ImmoRadar kostenlos?',
    answer: 'Ja, die Nutzung von ImmoRadar ist völlig kostenlos. Es fallen keine Gebühren oder versteckten Kosten an.',
  },
  {
    question: 'Welche Immobilien-Webseiten werden von ImmoRadar durchsucht?',
    answer: 'ImmoRadar durchsucht alle großen und relevanten Immobilien-Webseiten in Deutschland. Dazu gehören aktuell Immobilienscout24, Immowelt und Kleinanzeigen. Die Liste wird in Zukunft noch erweitert. Fehlt eine wichtige Immobilien-Webseite? Schreibe mir eine E-Mail.',
  },
  {
    question: 'Wie kann ich Benachrichtigungen für neue Angebote aktivieren?',
    answer: 'Um Benachrichtigungen zu aktivieren, geben Sie einfach Ihre Suchkriterien ein und klicken Sie auf den Button "Benachrichtigungen aktivieren". Sie erhalten dann eine E-Mail, sobald eine neue Wohnung, die Ihren Kriterien entspricht, gelistet wird.',
  },
  {
    question: 'Wie oft werden die Suchergebnisse aktualisiert?',
    answer: 'Aktuell werden die Immobilien-Webseiten etwa alle 10 Minuten auf neue Einträge überprüft. In Zukunft wird diese Frequenz erhöht um sicherzustellen, dass Sie immer die aktuellsten Einträge sehen können.',
  }
];

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
              <SearchBar />
              <Card fs="sm" p="sm" bg="cyan.1" radius="sm" mb="sm" shadow="none" opacity={0.7} w="100%">
                <Text size="sm" fs="italic">
                  ImmoRadar befindet sich aktuell in der Beta-Phase. Aktuell werden nur Suchanfragen für "Berlin" unterstützt.<br/>Alle anderen Städte / Bezirke werden in Kürze hinzugefügt.
                </Text>
              </Card>
            </Group>
          </Box>
          <Flex justify="space-between" align={{ base: 'left', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={{ base: 'xl', sm: 'xl'}} maw={{ base: "350px", sm: "100%"}} m="0 auto">
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconList size={24} /></ThemeIcon>
              <Text ta={{ base: 'left', sm: 'center'}}>Eine einzige, gut sortierte Liste ohne Duplikate</Text>
            </Flex>
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconBell size={24} /></ThemeIcon>
              <Text ta={{ base: 'left', sm: 'center'}}>Benachrichtigungen bei neuen Angeboten</Text>
            </Flex>
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconClock size={24} /></ThemeIcon>
              <Text ta={{ base: 'left', sm: 'center'}}>Kein mühsames Durchsuchen mehrerer Webseiten</Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      <Logos />

      <Box my="6em">
        <FeatureCards />
      </Box>

      <Container my="6em" size="sm">
        <Title order={2} fz={36} fw={700} mb="lg" ta="center">Häufig gestellte Fragen</Title>
        <Accordion variant="contained">
          {faqs.map((item) => (
            <Accordion.Item key={item.question} value={item.question}>
              <Accordion.Control><Text fw={500}>{item.question}</Text></Accordion.Control>
              <Accordion.Panel>{item.answer}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
      
      <Box my="6em">
        <Button
          variant="filled"
          // color="primary"
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
