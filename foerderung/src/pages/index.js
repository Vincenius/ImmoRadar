import { Flex, Text, Button, Title, Box, Blockquote, Image, Accordion, Divider, List, ThemeIcon, Card } from '@mantine/core';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import { IconCheck, IconCheckbox, IconQuote } from '@tabler/icons-react';
import NextImage from 'next/image';
import Pricing from '@/components/Pricing/Pricing';
import ButtonMultiLine from '@/components/Inputs/ButtonMultiLine';
import QuoteSlider from '@/components/QuoteSlider/QuoteSlider';

const FaqItem = ({ question, answer }) => <Accordion.Item value={question}>
  <Accordion.Control><b>{question}</b></Accordion.Control>
  <Accordion.Panel>{answer}</Accordion.Panel>
</Accordion.Item>

export default function Foerderung() {
  return (
    <Layout
      title="Finde die besten Zuschüsse und Kredite für Dein Bau- oder Sanierungsprojekt"
      description=" Bekommst kostenlos eine Übersicht aller relevanten Zuschüsse und Förderkredite, individuell abgestimmt auf Dein Projekt und Deine Region."
    >
      <Box className={styles.header} py="xl">
        <div className={styles.backgroundImage}>
          <Image
            component={NextImage}
            src="/imgs/family.jpg"
            alt="Familie unter einem Hausdach"
            height={300}
            width={500}
            w="100%"
            h="100%"
          />
        </div>

        <Flex mih="calc(100vh - 70px - 64px)" h="100%" direction="column" justify="space-evenly">
          <Flex gap="xl" direction="column" justify="center" align={{ base: 'center', md: 'start' }}>
            <Box my={{ base: '4em', sm: '8em' }}>
              <Title mb="md" fw="lighter" className={styles.title}>Jetzt Deine Fördermittel sichern - mit nur einem Klick zur passenden Förderung</Title>
              <Title order={2} size="h4" mb="3em" fw="normal" w="70%">
                Mit dem kostenlosen Förderreport findest Du in weniger als 2 Minuten die besten Förderungen für Dein Bauvorhaben - bundesweit, regional & individuell.
              </Title>
              <ButtonMultiLine component={Link} href="/foerdercheck" size="xl" p="md" leftSection={<IconCheckbox size={24} />}>
                Jetzt Förderprogramme prüfen
              </ButtonMultiLine>
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Box pt="6em" pb="10em" pos="relative">
        <Box pos="absolute" w="100vw" h="100%" bg="white" left="50%" top="0" style={{ transform: 'translateX(-50%)', zIndex: -1 }}></Box>
        <Title order={2} ta="center" mb="2em" size="h1" textWrap="balance">Fördermittel in 3 einfachen Schritten!</Title>

        <Flex align="center" gap="xl" justify="center" mx="auto" maw={800} direction={{ base: "column-reverse", sm: "row" }}>
          <Box>
            <Title order={3} mb="md">Fragebogen ausfüllen</Title>
            <Text>Beantworte ein paar Fragen zu Deinem Bau- oder Sanierungsvorhaben. So findest Du die besten Förderprogramme für dich – regional, aktuell & passend.</Text>
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
            <Title order={3} mb="md">Übersicht Deiner Förderchancen erhalten</Title>
            <Text>Du bekommst <b>kostenlos</b> eine Liste mit relevanten Zuschüssen & Krediten – individuell abgestimmt auf Dein Projekt.</Text>
          </Box>
        </Flex>

        <Flex justify="center" my="xl"><Divider orientation="vertical" h="4em" size="md" variant="dashed" /></Flex>

        <Flex align="center" gap="xl" justify="center" mb="xl" mx="auto" maw={800} direction={{ base: "column-reverse", sm: "row" }}>
          <Box>
            <Title order={3} mb="md">Antrag stellen – schnell & ohne Umwege</Title>
            <Text>Dank der Premium-Variante sparst Du Dir stundenlange Recherche. Du bekommst eine einfache Anleitung zur Beantragung aller Förderungen, die zu Deinem Projekt passen.</Text>
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

        {/* WARUM SINNVOLL */}
        <Box pt="8em" pb="8em">
          <Card radius="md" p="0" withBorder shadow="md">
            <Flex gap="lg" align="center" direction={{ base: 'column', md: 'row' }} >
              <Image
                component={NextImage}
                src="/imgs/family-2.jpg"
                alt="Mutter und Vater schieben Kind in einer Umzugskiste durch das Haus"
                height={300}
                width={500}
                w={{ base: '100%', md: '500px' }}
                h={{ base: '200px', md: '100%' }}
                mah="400px"
              />
              <Box p="xl">
                <Title order={2} ta="center" mb="md">Warum das sinnvoll ist</Title>
                <Text ta="center" mb="lg" maw={800} mx="auto" fs="italic">
                  In Deutschland gibt es über 5.000 Förderprogramme. Viele Bauherren und Sanierer wissen nicht, welche davon zu ihrem Projekt passen – und verschenken so tausende Euros. Mit dem Förderreport vermeidest du teure Fehler und erkennst alle relevanten Förderungen auf einen Blick.
                </Text>
              </Box>
            </Flex>
          </Card>
        </Box>
      </Box>

      <Box py="8em" pos="relative">
        <Box mt="-14em" mb="8em" gap="4em">
          <QuoteSlider quotes={[
            {
              text: "„Dank dem Förderreport habe ich 20.000,-€ Fördermittel für meine Haussanierung gefunden - das hätte ich sonst nie entdeckt. Einfach zu bedienen, kostenlos und richtig wertvoll!“",
              author: "– Stefan W., Sanierung"
            },
            {
              text: "„Ich wusste gar nicht, dass es so viele Fördermöglichkeiten gibt! Mit der Premium-Version konnte ich den Antrag schnell und korrekt ausfüllen ohne stundenlang zu recherchieren.“",
              author: "– Nina M., Neubau"
            },
            {
              text: "„Ich hatte vorher schon recherchiert, aber die Struktur hier hat mir bestimmt zwei Tage Arbeit abgenommen.“",
              author: "– David P., Sanierung"
            },
            {
              text: "„Ohne den Starter-Check hätten wir das 5.000 ,-€ Zuschussprogramm der Stadt total verpasst. Jetzt ist’s fix beantragt.“",
              author: "– Sandra K., Sanierung"
            },
            {
              text: "„Wir wollten es selbst in die Hand nehmen – der Förderreport Starter hat uns sofort das richtige Fundament gegeben.“",
              author: "– Jonas H., Neubau"
            },
            {
              text: "„Durch die Anleitung haben wir 12.400 ,-€ für unseren Neubau erhalten – ohne Berater, einfach Schritt für Schritt umgesetzt.“",
              author: "– Miriam S., Neubau"
            },
          ]} />
        </Box>

        <Title order={2} ta="center" mb="xl" size="h1">Preise</Title>
        <Pricing
          showFree
          plan="free"
          CtaStarter={<Button size="md" component={Link} href="/foerdercheck" fullWidth>
            Jetzt starten!
          </Button>}
          CtaPremium={<Button size="md" component={Link} href="/foerdercheck" fullWidth>
            Jetzt starten!
          </Button>}
          CtaPremiumPlus={<Button size="md" fullWidth disabled>
            Mit Premium Verfügbar
          </Button>}
        />
      </Box>

      <Box pb="8em" pos="relative">
        <Title order={2} ta="center" mb="xl" size="h1">Stimmen vom Team</Title>
        <QuoteSlider quotes={[
          {
            text: '„Förderung muss nicht kompliziert sein – das war mein Anspruch bei der Entwicklung. Der Förderreport vereint technologische Präzision mit intuitivem Design. In wenigen Klicks erhalten Nutzer:innen eine individuelle Übersicht und konkrete Schritte – ohne Fachjargon, aber mit Tiefgang. "So wird aus einem Bürokratie-Monster ein Werkzeug, das wirklich hilft.“',
            author: "– Vincent, Webentwickler – UI & UX",
            img: "/imgs/team/vincent.jpg"
          },
          {
            text: "„Wer Förderung beantragen will, muss oft durch einen Paragrafendschungel – und läuft Gefahr, durch Formfehler oder Fristen wichtige Gelder zu verlieren. Der Förderreport vereinfacht diesen Prozess enorm: Er zeigt, was möglich ist, welche Bedingungen gelten und wo Stolpersteine liegen. So werden nicht nur Chancen sichtbar, sondern Risiken reduziert. “Ein wertvolles Werkzeug mit klarem Nutzen.",
            author: "– Sergey, Rechtsberater",
            img: "/imgs/team/sergey.jpg"
          },
          {
            text: '„Förderprogramme sind voller Möglichkeiten – und voller Stolperfallen. Ich liebe es, in jedes Detail zu gehen, um das Maximum für ein Projekt herauszuholen. "Wer Förderung clever nutzen will, findet hier den besten Einstieg.“',
            author: "– Michael, Experte für Förderungen",
            img: "/imgs/team/michael.jpg"
          },
          {
            text: '„Als Ingenieur weiß ich, dass eine gute Lösung immer strukturiert, logisch und effizient ist – genau das leistet unser Förderreport. Besonders in Kombination mit Finanzfragen bietet er Menschen eine realistische Einschätzung: Was ist machbar? Was ist förderfähig? Und wie wird aus einer Idee ein tragfähiges Projekt? Das Ergebnis: "Sicherheit, Planbarkeit – und oft zehntausende Euro mehr Spielraum.“',
            author: "– Christof, Maschinenbauingenieur – Förderungen",
            img: "/imgs/team/chris.jpg"
          },
        ]} />
      </Box>

      <Box py="6em" pos="relative">
        <Box pos="absolute" w="100vw" h="100%" bg="white" left="50%" top="0" style={{ transform: 'translateX(-50%)', zIndex: -1 }}></Box>
        <Title order={2} ta="center" mb="xl" size="h1">Häufig gestellte Fragen</Title>

        <Box bg="white" maw="600px" m="0 auto" >
          <Accordion bg="gray.0" radius="md" withBorder>
            <FaqItem
              question="Was kostet der Förderreport?"
              answer="Die Erstellung des Förderreports ist kostenlos. Mit der Starter-Variante (einmalig 39 ,-€) sparst Du Zeit und erhältst eine maßgeschneiderte Übersicht aller Fördermittel, die zu Deinem Projekt passen."
            />
            <FaqItem
              question="Welche Förderungen berücksichtigt der Förderreport?"
              answer={<Box>
                <Text mb="sm">Der Förderreport durchsucht für dich automatisch:</Text>
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
                <Text>Du bekommst nur die Fördermittel, die zu Deinem Projekt passen – aktuell, individuell und verständlich aufbereitet.</Text>
              </Box>}
            />
            <FaqItem
              question="Wie schnell erhalte ich mein Ergebnis?"
              answer="Direkt nach Ausfüllen des FörderChecks siehst Du sofort Deine persönlichen Fördermöglichkeiten – schnell, kostenlos und ohne Anmeldung."
            />
            <FaqItem
              question="Kann ich die Starter- oder Premium-Variante auch nachträglich kaufen?"
              answer="Ja, ein Upgrade ist jederzeit möglich. Du kannst mit der kostenlosen Version starten und später bequem auf eine der Upgrade Varianten umsteigen."
            />
          </Accordion>
        </Box>
      </Box>

      <Box py="8em" pos="relative">
        <div className={styles.backgroundImage}>
          <Image
            component={NextImage}
            src="/imgs/couple.jpg"
            alt="Zwei Personen die sich fröhlich Papiere über ihren kopf halten"
            height={300}
            width={500}
            w="100%"
            h="100%"
          />
        </div>
        <Box align="center">
          <Title order={2} ta="center" mb="md" size="h1">Unverbindlich Förderungen prüfen – kostenlos & individuell</Title>
          <Text mb="3em" fs="italic">Finde mit dem Förderreport ganz einfach heraus, welche Zuschüsse, Kredite und Förderprogramme für Deinen Bau oder Deine Sanierung möglich sind. Kein Risiko – sofort loslegen.</Text>
          <Button leftSection={<IconCheckbox size={24} />} size="xl" component={Link} href="/foerdercheck">Jetzt Förderreport erstellen!</Button>
        </Box>
      </Box>

    </Layout>
  );
}
