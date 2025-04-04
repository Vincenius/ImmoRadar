import { Flex, Text, Group, Button, Title, Box, Blockquote, Image } from '@mantine/core';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import { IconQuote } from '@tabler/icons-react';
import NextImage from 'next/image';


export default function Foerderung() {
  return (
    <Layout
      title="Förderradar"
      description="todo"
      noindex={true} // todo
    >
      <Box className={styles.header} py="xl">
        <div className={styles.background}></div>

        <Flex mih="calc(100vh - 70px - 64px)" h="100%" direction="column" justify="space-evenly">
          <Flex gap="xl" direction="column" justify="center" align={{ base: 'center', md: 'start' }}>
            <Box p={{ base: "sm", sm: "xl", md: "0" }}>
              <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 60 }} fw="bold" mb="lg" mt={{ base: 'xl', md: 0 }} textWrap="balance">
                Der <span className={styles.gradientText}>FörderCheck</span>.
              </Title>
              <Title order={2} fz={{ base: 24, xs: 32, sm: 40, md: 48 }} ta={{ base: 'center', md: 'left' }} mb="xl" fw={300}>
                Finde die besten Zuschüsse und Kredite für dein Bau- oder Sanierungsprojekt
              </Title>
            </Box>

            <Button size="xl" component={Link} href="/foerdercheck">Jetzt den FörderCheck starten!</Button>
          </Flex>
        </Flex>
      </Box>
      <Box py="6em" pos="relative">
        <Box pos="absolute" w="100vw" h="100%" bg="white" left="50%" top="0" style={{ transform: 'translateX(-50%)', zIndex: -1 }}></Box>
        <Title order={2} ta="center" mb="xl" size="h1">So funktioniert's</Title>

        <Flex align="center" gap="xl" justify="center" mb="xl" mx="auto" maw={600}>
          <Box>
            <Title order={3} mb="md">Fragebogen ausfüllen</Title>
            <Text>Geben Sie einige Informationen zu Ihrem Projekt an.</Text>
          </Box>
          <Image
            radius="md"
            component={NextImage}
            src="/imgs/illustration-question.png"
            alt="Illustration Fragebogen"
            height={200}
            width={200}
            w={200}
          />
        </Flex>

        <Flex align="center" gap="xl" justify="center" mb="xl" mx="auto" maw={600}>
          <Image
            radius="md"
            component={NextImage}
            src="/imgs/illustration-search.png"
            alt="Illustration Fragebogen"
            height={200}
            width={200}
            w={200}
          />
          <Box>
            <Title order={3} mb="md">Passende Förderungen erhalten</Title>
            <Text>Sofortige Auswertung aller relevanten Programme.</Text>
          </Box>
        </Flex>
        <Flex align="center" gap="xl" justify="center" mb="xl" mx="auto" maw={600}>
          <Box>
            <Title order={3} mb="md">Anleitung zur Antragstellung</Title>
            <Text>Mit unserer Premium-Variante erhalten Sie eine Schritt-für-Schritt-Anleitung.</Text>
          </Box>
          <Image
            radius="md"
            component={NextImage}
            src="/imgs/illustration-files.png"
            alt="Illustration Fragebogen"
            height={200}
            width={200}
            w={200}
          />
        </Flex>
      </Box>
      {/* <Box py="4em" pos="relative">
        <Box className={styles.skewed} />

        <Flex gap="4em" direction={{ base: 'column', xs: 'row' }}>
          <Blockquote icon={<IconQuote />} radius="sm" color="cyan" cite="– Lukas W." w="100%" styles={{ root: { backgroundColor: 'var(--mantine-primary-color-0)' } }}>
            Der Mietvertrag-Generator hat mir viel Zeit und Stress erspart! Einfach zu bedienen und rechtlich auf dem neuesten Stand.
          </Blockquote>

          <Blockquote icon={<IconQuote />} radius="sm" color="cyan" cite="– Sarah K." w="100%" styles={{ root: { backgroundColor: 'var(--mantine-primary-color-0)' } }}>
            So unkompliziert war das Erstellen von Mietverträgen noch nie. Der Preis ist unschlagbar.
          </Blockquote>
        </Flex>
      </Box> */}
      {/* 


Das sagen unsere Nutzer:

„Dank FörderCheck habe ich eine Förderung von 20.000€ entdeckt, die mir vorher nicht bekannt war. Super einfache Anwendung!"⭐⭐⭐⭐⭐ - Stefan M.

„Ich wusste nicht, dass es so viele Möglichkeiten gibt! Die Premium-Version hat mir sehr geholfen, den Antrag richtig auszufüllen.“⭐⭐⭐⭐⭐ - Lisa K.

Preise & Pakete

📚 Kostenlose Version

Individuelle Liste aller Förderprogramme als PDF

Ohne detaillierte Anleitung zur Antragstellung

➔ Jetzt kostenlos starten [CTA-Button]

💎 Premium-Paket (XX € einmalig)

Alle Funktionen der kostenlosen Version

Detaillierte Schritt-für-Schritt-Anleitung zur Antragstellung

Tipps zur Maximierung Ihrer Fördermittel

➔ Jetzt Premium sichern [CTA-Button]

Häufig gestellte Fragen (FAQ)

Was kostet der FörderCheck?Die Basisversion ist kostenlos! Die Premium-Version bietet zusätzliche Unterstützung für eine einmalige Gebühr.

Welche Förderungen werden berücksichtigt?Wir analysieren bundesweite, landesspezifische und regionale Förderprogramme sowie KfW-Kredite und Zuschüsse.

Wie schnell erhalte ich mein Ergebnis?Unmittelbar nach Beantwortung des Fragebogens.

Kann ich die Premium-Version später noch erwerben?Ja! Sie können jederzeit auf Premium upgraden. */}
    </Layout>
  );
}
