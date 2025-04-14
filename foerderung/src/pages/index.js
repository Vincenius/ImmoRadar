import { Flex, Text, Group, Button, Title, Box, Blockquote, Image, Accordion } from '@mantine/core';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import { IconQuote } from '@tabler/icons-react';
import NextImage from 'next/image';
import Pricing from '@/components/Pricing/Pricing';

const FaqItem = ({ question, answer }) => <Accordion.Item value={question}>
  <Accordion.Control><b>{question}</b></Accordion.Control>
  <Accordion.Panel>{answer}</Accordion.Panel>
</Accordion.Item>

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

            <Button size="xl" component={Link} href="/foerdercheck">Jetzt FörderCheck starten!</Button>
          </Flex>
        </Flex>
      </Box>
      <Box py="6em" pos="relative">
        <Box pos="absolute" w="100vw" h="100%" bg="white" left="50%" top="0" style={{ transform: 'translateX(-50%)', zIndex: -1 }}></Box>
        <Title order={2} ta="center" mb="xl" size="h1">So funktioniert's</Title>

        <Flex align="center" gap="xl" justify="center" mb="xl" mx="auto" maw={800} direction={{ base: "column-reverse", sm: "row" }}>
          <Box>
            <Title order={3} mb="md">Fragebogen ausfüllen</Title>
            <Text>Teile uns ein paar Informationen zu deinem Vorhaben mit und beantworte gezielte Fragen. So stellen wir sicher, dass du nur passende Förderprogramme erhältst.</Text>
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

        <Flex align="center" gap="xl" justify="center" mb="xl" mx="auto" maw={800} direction={{ base: "column", sm: "row" }}>
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
            <Title order={3} mb="md">Passende Förderungen erhalten</Title>
            <Text>Du bekommst kostenlos eine Übersicht relevanter Zuschüsse und Förderkredite, individuell abgestimmt auf dein Projekt und deine Region.</Text>
          </Box>
        </Flex>
        <Flex align="center" gap="xl" justify="center" mb="xl" mx="auto" maw={800} direction={{ base: "column-reverse", sm: "row" }}>
          <Box>
            <Title order={3} mb="md">Anleitung zur Antragstellung</Title>
            <Text>Mit unserer Premium-Variante erhältst du Zugang zu weiteren Förderprogrammen sowie einer detaillierten Schritt-für-Schritt-Anleitung für deinen Förderantrag.</Text>
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
            Dank dem FörderCheck habe ich eine Förderung von 20.000€ entdeckt, die mir vorher nicht bekannt war. Super einfache Anwendung!
          </Blockquote>

          <Blockquote icon={<IconQuote />} radius="sm" color="cyan" cite="– Nina M." w="100%" styles={{ root: { backgroundColor: 'var(--mantine-primary-color-0)' } }}>
            Ich wusste nicht, dass es so viele Möglichkeiten gibt! Die Premium-Version hat mir sehr geholfen, den Antrag richtig auszufüllen.
          </Blockquote>
        </Flex>
        <Box pos="absolute" w="100vw" h="100%" bg="white" left="50%" top="0" style={{ transform: 'translateX(-50%)', zIndex: -1 }}></Box>
        <Title order={2} ta="center" mb="xl" size="h1">Häufig gestellte Fragen</Title>

        <Box bg="white" maw="600px" m="0 auto" >
          <Accordion bg="gray.0" radius="md" withBorder>
            <FaqItem
              question="Was kostet der FörderCheck?"
              answer="Die Basisversion ist kostenlos! Die Premium-Version bietet zusätzliche Unterstützung für eine einmalige Gebühr."
            />
            <FaqItem
              question="Welche Förderungen werden berücksichtigt?"
              answer="Wir analysieren bundesweite, landesspezifische und regionale Förderprogramme sowie KfW-Kredite und Zuschüsse."
            />
            <FaqItem
              question="Wie schnell erhalte ich mein Ergebnis?"
              answer="Unmittelbar nach Beantwortung des Fragebogens."
            />
            <FaqItem
              question="Kann ich die Premium / Professional-Version später noch erwerben?"
              answer="Ja! Sie können jederzeit auf Premium oder Professional upgraden ohne den Fragebogen erneut ausfüllen zu müssen."
            />
          </Accordion>
        </Box>
      </Box>

      <Box py="6em" pos="relative">
        <div className={styles.background}></div>
        <Box align="center">
          <Title order={2} ta="center" mb="md" size="h1">Unverbindlich ausprobieren</Title>
          <Text mb="3em" fs="italic">Finde kostenlos und unkompliziert heraus, welche Fördermittel dir zustehen</Text>
          <Button size="xl" component={Link} href="/foerdercheck">Jetzt FörderCheck Starten!</Button>
        </Box>
      </Box>

    </Layout>
  );
}
