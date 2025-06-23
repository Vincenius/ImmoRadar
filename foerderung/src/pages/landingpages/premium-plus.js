import {
  Flex,
  Text,
  Title,
  Box,
  Accordion,
  List,
  ThemeIcon,
  Card,
  Table,
  Image
} from '@mantine/core';
import Layout from '@/components/Layout/Layout';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  IconCheck,
  IconDownload,
  IconUser,
  IconCalendar,
  IconDeviceLaptop,
  IconTargetArrow,
  IconRocket
} from '@tabler/icons-react';
import Button from '@/components/Inputs/ButtonMultiLine';
import QuoteSlider from '@/components/QuoteSlider/QuoteSlider';

const FaqItem = ({ question, answer }) => (
  <Accordion.Item value={question}>
    <Accordion.Control><b>{question}</b></Accordion.Control>
    <Accordion.Panel>{answer}</Accordion.Panel>
  </Accordion.Item>
);

export default function FoerdercheckPremiumPlus() {
  return (
    <Layout
      title="Förderreport Premium Plus – Persönliche Beratung & Förderstrategie"
      description="Mit dem Premium Plus Paket erhältst Du persönliche Beratung durch Förder- und Finanzexpert:innen."
    >
      {/* HERO SECTION */}
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
        <Flex mih="calc(100vh - 70px - 64px)" direction="column" justify="center">
          <Title fw="lighter" className={styles.title} mb="md">
            Wieviel Haus kannst Du Dir wirklich leisten – mit allen Förderungen?
          </Title>
          <Title order={2} size="h4" fw="normal" mb="lg">
            Mit dem Premium Plus Paket erhältst Du eine persönliche Online-Beratung mit einem unserer Förder- & Finanzexperten. Gemeinsam analysieren wir Dein Vorhaben und erstellen eine exklusive Strategie – von der Förderübersicht bis zur Antragstellung.
          </Title>
          <List spacing="xs">
            <List.Item icon={<IconDeviceLaptop size={18} />}>1:1-Beratung via Microsoft Teams</List.Item>
            <List.Item icon={<IconTargetArrow size={18} />}>Individuelle Finanzübersicht + Förderstrategie</List.Item>
            <List.Item icon={<IconDownload size={18} />}>Unterstützung bis zur Auszahlung</List.Item>
          </List>
          <Button maw="500px" mt="xl" size="xl" component={Link} href="/foerdercheck" leftSection={<IconUser size={24} />}>Persönliche Förderberatung buchen – 199 ,-€</Button>
          <Text fs="italic" mt="md">Kostenloses Erstgespräch, Entscheide später ob Dir die Zusammenarbeit das Geld wert ist.</Text>
        </Flex>
      </Box>

      {/* FÜR WEN */}
      <Box py="6em">
        <Card shadow="md" radius="md" p="xl" withBorder maw={800} mx="auto">
          <Title order={2} ta="center" mb="md">Für wen ist die Premium Plus Beratung gedacht?</Title>
          <List spacing="lg" center icon={<ThemeIcon color="green.9" variant="light" size={24} radius="xl"><IconCheck size={16} /></ThemeIcon>} maw={600} mx="auto">
            <List.Item>…Du planst zu bauen, zu kaufen oder umfassend zu sanieren</List.Item>
            <List.Item>…Du willst auf Nummer sicher gehen bei Finanzierung & Förderung</List.Item>
            <List.Item>…Du möchtest von Anfang bis Ende begleitet werden</List.Item>
            <List.Item>…Du willst wissen, was realistisch möglich ist – und was nicht</List.Item>
          </List>
        </Card>
      </Box>

      {/* WARUM SINNVOLL */}
      <Box pt="3em" pb="8em">
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
                In Deutschland gibt es über 5.000 Förderprogramme. Viele Bauherren und Sanierer wissen nicht, was davon zu ihrem Projekt passt – und verschenken so tausende Euro.
                Mit dem Förderreport vermeidest Du teure Fehler und erkennst alle relevanten Förderungen auf einen Blick.
              </Text>
            </Box>
          </Flex>
        </Card>
      </Box>

      {/* STIMMEN */}
      <Box py="6em">
        <Title order={2} ta="center" mb="xl">Stimmen unserer Kund:innen</Title>
        <QuoteSlider quotes={[
          {
            text: "„Die Beratung hat uns 22.000 ,-€ gesichert – aber vor allem Klarheit gebracht, was wir uns mit Förderung leisten können. Ohne euch hätten wir’s nie gewagt.“",
            author: "– Kerstin B., Neubau"
          },
          {
            text: "„Wir haben in 45 Minuten Beratung mehr gelernt als in 3 Wochen Eigenrecherche – und das komplette Konzept bis zur Auszahlung bekommen.“",
            author: "– Pascal M., Sanierung"
          },
          {
            text: "„Alles aus einer Hand – Förderstrategie, Antrag, Energieberater-Kontakt. 100 % Weiterempfehlung, gerade bei größeren Sanierungen.“",
            author: "– Tamara D., Sanierung"
          },
          {
            text: "„Durch euch haben wir 19.500 ,-€ erhalten, weil wir nichts übersehen haben. Das persönliche Gespräch war der Schlüssel.“",
            author: "– Jonas T., Neubau"
          },
          {
            text: "„Wir wollten’s richtig machen. Dank Premium Plus hatten wir nicht nur eine Übersicht, sondern ein durchdachtes Förder- & Finanzierungskonzept.“",
            author: "– Laura & Sven M., Sanierung"
          },
          {
            text: "„Ohne euch hätten wir wichtige Förderungen verpasst. Die individuelle Analyse hat uns nicht nur Geld, sondern auch viele Nerven gespart.“",
            author: "– Familie H., Neubau"
          }
        ]} />

      </Box>

      {/* ABLAUF */}
      <Box py="6em" bg="gray.0">
        <Card shadow="md" radius="md" withBorder maw={800} mx="auto">
          <Card.Section p="0">
            <Image
              component={NextImage}
              src="/imgs/haus.jpg"
              alt="Model von einem Haus"
              height={300}
              width={800}
              w="100%"
              h="100%"
            />
          </Card.Section>
          <Card.Section p="xl">
            <Title order={2} ta="center" mb="xl">So läuft Deine Premium Plus Beratung ab</Title>
            <List spacing="md" center maw={600} mx="auto" mb="xl" icon={<IconCalendar size={20} />}>
              <List.Item>Förderreport Premium erstellen</List.Item>
              <List.Item>Hinterlasse Deine Kontaktdaten</List.Item>
              <List.Item>Wir melden uns telefonisch bei Dir, um einen Termin zu vereinbaren(per Microsoft Teams)</List.Item>
              <List.Item>Wir besprechen Dein Bauvorhaben und gehen mit Dir die einzelnen Schritte durch</List.Item>
              <List.Item>Du entscheidest danach, ob aus Deiner Sicht eine Zusammenarbeit Sinn macht</List.Item>
            </List>
            <Text mt="lg" ta="center" fs="italic">➡️ Du bekommst Klarheit, Sicherheit und persönliche Unterstützung – statt Formularchaos & Internetrecherche.</Text>
          </Card.Section>
        </Card>
      </Box>

      {/* PAKETINHALT */}
      <Box py="6em" pos="relative">
        <Title order={2} ta="center" mb="xl">📦 PREMIUM PLUS AUF EINEN BLICK</Title>

        <Table maw={700} mx="auto" striped highlightOnHover withBorder bg="white" withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Feature</Table.Th>
              <Table.Th>Enthalten</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr><Table.Td>Förderliste & Anleitung</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Persönliche 1:1-Beratung (Microsoft Teams)</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Finanzübersicht: Was ist realistisch möglich?</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Maßgeschneiderte Förderstrategie</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Vernetzung mit Energieberater:innen</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Individuelle Konzepterstellung für Dein Projekt</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
          </Table.Tbody>
        </Table>

        <Text ta="center" mt="md">💶 Jetzt zum Komplettpreis: 199 ,-€ (einmalig, kein Abo)</Text>

        <Box ta="center" mt="md">
          <Button size="lg" leftSection={<IconRocket size={24} />} component={Link} href="/foerdercheck">
            Jetzt Förderreport Premium Plus erstellen
          </Button>
        </Box>
      </Box>


      {/* FAQ */}
      <Box py="6em" pos="relative">
        <Box
          pos="absolute"
          w="100vw"
          h="100%"
          bg="white"
          left="50%"
          top="0"
          style={{ transform: 'translateX(-50%)', zIndex: -1 }}
        />
        <Title order={2} ta="center" mb="xl">❓ HÄUFIGE FRAGEN (FAQ)</Title>
        <Box maw="600px" m="0 auto">
          <Accordion bg="gray.0" radius="md" withBorder>
            <FaqItem
              question="Was passiert im Beratungsgespräch genau?"
              answer="Du sprichst mit einem erfahrenen Förder- & Finanzexperten. Wir analysieren Deine Situation, kalkulieren realistische Möglichkeiten und leiten daraus Deine persönliche Förderstrategie ab – inkl. aller nächsten Schritte."
            />
            <FaqItem
              question="Wer übernimmt die Antragstellung?"
              answer="Die Antragstellung kann nur durch Dich erfolgen. Wir sagen Dir, welche Dokumente gebraucht werden."
            />
            <FaqItem
              question="Was, wenn ich noch unsicher bin?"
              answer="Kein Problem – unser Beratungsgespräch ist offen, ehrlich und individuell. Du entscheidest danach, wie es weitergeht."
            />
          </Accordion>
        </Box>
      </Box>

      {/* ABSCHLUSS CTA */}
      <Box py="6em" pos="relative">
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
        <Title order={2} ta="center" mb="md">🔔 ES GEHT UM DEINE ZUKUNFT</Title>
        <Text ta="center" mb="lg" maw={800} mx="auto">
          🏠 Der Weg ins Eigenheim ist oft komplex – aber Du musst ihn nicht allein gehen. <br />
          🎯 Lass uns gemeinsam Dein Projekt auf sichere Beine stellen – mit Strategie, Struktur und persönlicher Begleitung. <br />
          👉 Jetzt Förderreport Premium Plus erstellen und mit Klarheit loslegen
        </Text>
        <Box ta="center">
          <Button
            size="xl"
            component={Link}
            leftSection={<IconRocket size={24} />}
            href="/foerdercheck"
          >
            Beratung starten – 199 ,-€ investieren, Tausende sparen
          </Button>
        </Box>
      </Box>

    </Layout>
  );
}
