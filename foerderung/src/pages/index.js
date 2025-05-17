import { Flex, Text, Group, Button, Title, Box, Blockquote, Image, Accordion, Divider, List, ThemeIcon } from '@mantine/core';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import { IconCheck, IconCheckbox, IconQuote } from '@tabler/icons-react';
import NextImage from 'next/image';
import Pricing from '@/components/Pricing/Pricing';

const FaqItem = ({ question, answer }) => <Accordion.Item value={question}>
  <Accordion.Control><b>{question}</b></Accordion.Control>
  <Accordion.Panel>{answer}</Accordion.Panel>
</Accordion.Item>

export default function Foerderung() {
  return (
    <Layout
      title="Finde die besten Zuschüsse und Kredite für dein Bau- oder Sanierungsprojekt"
      description=" Bekommst kostenlos eine Übersicht aller relevanten Zuschüsse und Förderkredite, individuell abgestimmt auf dein Projekt und deine Region."
    >
      <Box className={styles.header} py="xl">
        <div className={styles.background}></div>

        <Flex mih="calc(100vh - 70px - 64px)" h="100%" direction="column" justify="space-evenly">
          <Flex gap="xl" direction="column" justify="center" align={{ base: 'center', md: 'start' }}>
            <Box my={{ base: '4em', sm: '8em' }}>
              {/* https://mantine.dev/core/transition/ */}
              <Title mb="md" fw="lighter" className={styles.title}>Mehr Geld für dein Zuhause - mit nur einem Klick zur passenden Förderung</Title>
              <Title order={2} size="h4" mb="3em" fw="normal" w="70%">
                Mit dem kostenlosen FörderCheck findest du in weniger als 2 Minuten die besten Förderungen für dein Bauvorhaben - bundesweit, regional & individuell.
              </Title>
              <Button component={Link} href="/foerdercheck" size="xl" leftSection={<IconCheckbox size={24} />}>
                Jetzt Förderprogramme prüfen
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Box py="6em" pos="relative">
        <Box pos="absolute" w="100vw" h="100%" bg="white" left="50%" top="0" style={{ transform: 'translateX(-50%)', zIndex: -1 }}></Box>
        <Title order={2} ta="center" mb="2em" size="h1" textWrap="balance">Fördermittel in 3 einfachen Schritten! So kommst du zu deinem Zuschuss:</Title>

        <Flex align="center" gap="xl" justify="center" mx="auto" maw={800} direction={{ base: "column-reverse", sm: "row" }}>
          <Box>
            <Title order={3} mb="md">Fragebogen ausfüllen</Title>
            <Text>Beantworte ein paar Fragen zu deinem Bau- oder Sanierungsvorhaben. So findest du die besten Förderprogramme für dich – regional, aktuell & passend.</Text>
          </Box>
          <Image
            radius="md"
            component={NextImage}
            src="/imgs/illustration-question.png"
            alt="Illustration Fragebogen"
            height={200}
            width={400}
            w={{ base: 200, sm: "auto" }}
            h={200}
          />
        </Flex>

        <Flex justify="center" my="xl"><Divider orientation="vertical" h="4em" size="md" variant="dashed" /></Flex>

        <Flex align="center" gap="xl" justify="center" mx="auto" maw={800} direction={{ base: "column", sm: "row" }}>
          <Image
            radius="md"
            component={NextImage}
            src="/imgs/illustration-search.png"
            alt="Illustration Fragebogen"
            height={200}
            width={400}
            w={{ base: 200, sm: "auto" }}
            h={200}
          />
          <Box>
            <Title order={3} mb="md">Übersicht deiner Förderchancen erhalten</Title>
            <Text>Du bekommst <b>kostenlos</b> eine Liste mit relevanten Zuschüssen & Krediten – individuell abgestimmt auf dein Projekt.</Text>
          </Box>
        </Flex>

        <Flex justify="center" my="xl"><Divider orientation="vertical" h="4em" size="md" variant="dashed" /></Flex>

        <Flex align="center" gap="xl" justify="center" mb="xl" mx="auto" maw={800} direction={{ base: "column-reverse", sm: "row" }}>
          <Box>
            <Title order={3} mb="md">Antrag stellen – schnell & ohne Umwege</Title>
            <Text>Dank der Premium-Variante sparst du dir stundenlange Recherche. Du bekommst eine einfache Anleitung zur Beantragung aller Förderungen, die zu deinem Projekt passen.</Text>
          </Box>
          <Image
            radius="md"
            component={NextImage}
            src="/imgs/illustration-files.png"
            alt="Illustration Fragebogen"
            height={200}
            width={400}
            w={{ base: 200, sm: "auto" }}
            h={200}
          />
        </Flex>
      </Box>

      <Box pt="6em" pb="12em" pos="relative">
        <Title order={2} ta="center" mb="xl" size="h1">Preise</Title>

        <Pricing showFree plan="free" />
      </Box>

      <Box py="8em" pos="relative">
        <Flex mt="-14em" mb="6em" gap="4em" direction={{ base: 'column', xs: 'row' }}>
          <Blockquote icon={<IconQuote />} radius="sm" color="cyan" cite="– Stefan W." w="100%" styles={{ root: { backgroundColor: 'var(--mantine-primary-color-0)' } }}>
            Dank dem FörderCheck habe ich 20.000 € Fördermittel für meine Haussanierung gefunden - das hätte ich sonst nie entdeckt. Einfach zu bedienen, kostenlos und richtig wertvoll!
          </Blockquote>

          <Blockquote icon={<IconQuote />} radius="sm" color="cyan" cite="– Nina M." w="100%" styles={{ root: { backgroundColor: 'var(--mantine-primary-color-0)' } }}>
            Ich wusste gar nicht, dass es so viele Fördermöglichkeiten gibt! Mit der Premium-Version konnte ich den Antrag schnell und korrekt ausfüllen ohne stundenlang zu recherchieren.
          </Blockquote>
        </Flex>
        <Box pos="absolute" w="100vw" h="100%" bg="white" left="50%" top="0" style={{ transform: 'translateX(-50%)', zIndex: -1 }}></Box>
        <Title order={2} ta="center" mb="xl" size="h1">Häufig gestellte Fragen</Title>

        <Box bg="white" maw="600px" m="0 auto" >
          <Accordion bg="gray.0" radius="md" withBorder>
            <FaqItem
              question="Was kostet der FörderCheck?"
              answer="Die Nutzung des FörderCheck ist kostenlos. Mit der Starter-Variante (einmalig 39 €) sparst du Zeit und erhältst eine maßgeschneiderte Übersicht aller Fördermittel, die zu deinem Projekt passen."
            />
            <FaqItem
              question="Welche Förderungen berücksichtigt der FörderCheck?"
              answer={<Box>
                <Text mb="sm">Der FörderCheck durchsucht für dich automatisch:</Text>
                <List
                  spacing="sm"
                  mb="sm"
                  center
                  icon={
                    <ThemeIcon color="cyan.9" variant="outline" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  <List.Item>Bundesweite, länderspezifische & regionale Programme</List.Item>
                  <List.Item>Zuschüsse & Kredite</List.Item>
                  <List.Item>Förderungen für Bau, Sanierung & Energieeffizienz</List.Item>
                </List>
                <Text>Du bekommst nur die Fördermittel, die zu deinem Projekt passen – aktuell, individuell und verständlich aufbereitet.</Text>
              </Box>}
            />
            <FaqItem
              question="Wie schnell erhalte ich mein Ergebnis?"
              answer="Direkt nach dem Ausfüllen des FörderCheck siehst du sofort deine persönlichen Fördermöglichkeiten – schnell, kostenlos und ohne Anmeldung."
            />
            <FaqItem
              question="Kann ich die Starter- oder Premium-Variante auch nachträglich kaufen?"
              answer="Ja, ein Upgrade ist jederzeit möglich. Du kannst mit der kostenlosen Version starten und später bequem auf Starter oder Premium umsteigen."
            />
          </Accordion>
        </Box>
      </Box>

      <Box py="6em" pos="relative">
        <div className={styles.background}></div>
        <Box align="center">
          <Title order={2} ta="center" mb="md" size="h1">Unverbindlich Förderungen prüfen – kostenlos & individuell</Title>
          <Text mb="3em" fs="italic">Finde mit dem FörderCheck ganz einfach heraus, welche Zuschüsse, Kredite und Förderprogramme für deinen Bau oder deine Sanierung möglich sind. Kein Risiko – sofort loslegen.</Text>
          <Button  leftSection={<IconCheckbox size={24} />} size="xl" component={Link} href="/foerdercheck">Jetzt FörderCheck Starten!</Button>
        </Box>
      </Box>

    </Layout>
  );
}
