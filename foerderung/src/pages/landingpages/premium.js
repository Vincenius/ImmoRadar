import {
  Flex,
  Text,
  Title,
  Box,
  Accordion,
  Divider,
  List,
  ThemeIcon,
  Table,
  Card,
  Image
} from '@mantine/core';
import Layout from '@/components/Layout/Layout';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  IconCheck,
  IconRocket,
  IconDownload,
} from '@tabler/icons-react';
import Button from '@/components/Inputs/ButtonMultiLine';
import QuoteSlider from '@/components/QuoteSlider/QuoteSlider';

const FaqItem = ({ question, answer }) => (
  <Accordion.Item value={question}>
    <Accordion.Control><b>{question}</b></Accordion.Control>
    <Accordion.Panel>{answer}</Accordion.Panel>
  </Accordion.Item>
);

export default function FoerdercheckPremium() {
  return (
    <Layout
      title="Förderreport Premium – Mit Schritt-für-Schritt-Anleitung zur Förderung"
      description="59 €, einmalig: Mit dem Premium-Förderreport erhältst du nicht nur alle passenden Zuschüsse – sondern auch eine Anleitung zur erfolgreichen Antragstellung."
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
            Du willst Förderung – aber keine Fehler machen?
          </Title>
          <Title order={2} size="h4" fw="normal" mb="lg">
            Mit dem Förderreport Premium bekommst du nicht nur eine Liste aller passenden Zuschüsse – sondern auch eine verständliche Schritt-für-Schritt-Anleitung zur Umsetzung.
          </Title>
          <List spacing="xs">
            <List.Item icon={<IconCheck size={18} />}>Alle Zuschüsse auf einen Blick</List.Item>
            <List.Item icon={<IconCheck size={18} />}>Klare Anleitung für die nächsten Schritte</List.Item>
            <List.Item icon={<IconCheck size={18} />}>Ideal für alle, die nichts übersehen wollen</List.Item>
          </List>
          <Button maw="440px" mt="xl" size="xl" component={Link} href="/foerdercheck" leftSection={<IconRocket size={24} />}>
            Förderreport Premium erstellen – 59 €
          </Button>
        </Flex>
      </Box>

      {/* WAS DU BEKOMMST */}
      <Box py="6em">
        <Card shadow="md" radius="md" p="xl" withBorder maw={800} mx="auto">
          <Title order={2} ta="center" mb="md">Was du bekommst</Title>
          <Text ta="center" mb="xl">Der Förderreport Premium ist perfekt für dich, wenn du…</Text>
          <List spacing="lg" center icon={<ThemeIcon color="cyan.9" variant="light" size={24} radius="xl"><IconCheck size={16} /></ThemeIcon>} maw={600} mx="auto">
            <List.Item>…nicht nur wissen willst, was es gibt – sondern wie du es bekommst</List.Item>
            <List.Item>…sicher gehen willst, nichts zu übersehen</List.Item>
            <List.Item>…Zuschüsse clever nutzen willst, ohne 10 Ämter anrufen zu müssen</List.Item>
          </List>

          <Divider my="xl" label="Du erhältst" />

          <Box ta="center">
            <List spacing="md" center icon={<IconDownload size={18} />} maw={600} mx="auto">
              <List.Item>Eine auf dich zugeschnittene Fördermittel-Liste</List.Item>
              <List.Item>Sortiert nach Region, Maßnahme und Zuständigkeit</List.Item>
              <List.Item>Eine detaillierte Anleitung zur Antragstellung</List.Item>
              <List.Item>Hinweise zu Fristen, Anforderungen und Kombinationsmöglichkeiten</List.Item>
            </List>
          </Box>
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
                Mit dem Förderreport vermeidest du teure Fehler und erkennst alle relevanten Förderungen auf einen Blick.
              </Text>
            </Box>
          </Flex>
        </Card>
      </Box>

      {/* STIMMEN */}
      <Box py="6em" pos="relative">
        <Box pos="absolute" w="100vw" h="100%" bg="white" left="50%" top="0" style={{ transform: 'translateX(-50%)', zIndex: -1 }}></Box>
        <Title order={2} ta="center" mb="xl">Was andere sagen</Title>
        <QuoteSlider quotes={[
          {
            text: "„Durch die Anleitung haben wir 12.400 € für unseren Neubau erhalten – ohne Berater, einfach Schritt für Schritt umgesetzt.“",
            author: "– Miriam S., Neubau"
          },
          {
            text: "„Das PDF war so klar aufgebaut, dass ich den Antrag für unsere Heizungsförderung in einer Stunde fertig hatte – inklusive Fristen und Kontaktstelle.“",
            author: "– Philipp E., Sanierung"
          },
          {
            text: "„Wir konnten drei Programme kombinieren – zusammen über 17.000 €. Ohne die Premium-Version hätte ich das nie durchblickt.“",
            author: "– Martina & Jörg B., Neubau"
          },
          {
            text: "„Ich war komplett überfordert mit den ganzen Förderseiten. Das Premium-Paket hat’s für mich entschlüsselt – Konzept, Anleitung, fertig.“",
            author: "– Daniel K., Sanierung"
          },
          {
            text: "„In weniger als einem Tag hatten wir alles beantragt – Förderliste, Anleitung, Umsetzungsplan. Es war alles dabei.“",
            author: "– Alina R., Sanierung"
          },
          {
            text: "„Ich hätte nie gedacht, dass Förderungen so planbar sind. Mit der Premium-Anleitung wussten wir genau, was wann zu tun ist – und haben 14.800 € bekommen.“",
            author: "– Timo L., Neubau"
          }
        ]} />

      </Box>

      {/* SO FUNKTIONIERT'S */}
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
            <Title order={2} ta="center" mb="xl">So funktioniert’s</Title>
            <List mb="lg" spacing="md" center maw={600} mx="auto" icon={<IconCheck size={20} />}>
              <List.Item>Projekt eingeben – wenige Klicks, keine Vorkenntnisse</List.Item>
              <List.Item>Premium-Check durchführen – Analyse durch unsere Datenbank</List.Item>
              <List.Item>Ergebnis & Anleitung erhalten – beides direkt per E-Mail</List.Item>
            </List>
            <Text mt="lg" ta="center" fs="italic">➡️ Danach weißt du genau, welche Förderung passt – und wie du sie richtig beantragst.</Text>
          </Card.Section>
        </Card>
      </Box>

      {/* PAKETINHALT */}
      <Box py="6em" pos="relative">
        <Title order={2} ta="center" mb="xl">Das Paket „Premium“ auf einen Blick</Title>

        <Table maw={700} mx="auto" striped highlightOnHover withBorder bg="white" withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Feature</Table.Th>
              <Table.Th>Enthalten</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr><Table.Td>Individuelle Förderliste</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Sortiert nach Zuständigkeit</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Erklärtexte & Hinweise</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Schritt-für-Schritt-Anleitung zur Antragstellung</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Energieberater-Abgleich</Table.Td><Table.Td>❌ Nicht enthalten</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Persönliche Beratung</Table.Td><Table.Td>❌ Nicht enthalten</Table.Td></Table.Tr>
          </Table.Tbody>
        </Table>
        <Text ta="center" mt="md">✅ Ideal für alle, die Förderung gezielt nutzen wollen.</Text>
        <Text ta="center" mb="md">💶 Nur 59 € – einmalig, kein Abo, keine versteckten Kosten</Text>
        <Box ta="center">
          <Button size="lg" leftSection={<IconRocket size={24} />} component={Link} href="/foerdercheck">Jetzt Förderreport Premium erstellen</Button>
        </Box>
      </Box>

      {/* FAQ */}
      <Box py="6em" pos="relative">
        <Box pos="absolute" w="100vw" h="100%" bg="white" left="50%" top="0" style={{ transform: 'translateX(-50%)', zIndex: -1 }}></Box>
        <Title order={2} ta="center" mb="xl">❓ HÄUFIGE FRAGEN (FAQ)</Title>
        <Box maw="600px" m="0 auto">
          <Accordion bg="gray.0" radius="md" withBorder>
            <FaqItem
              question="Was bringt mir die Anleitung konkret?"
              answer="Du erfährst, welche Unterlagen du brauchst, wo du den Antrag stellst, und wie du gängige Fehler vermeidest – auf den Punkt, ohne Paragraphen-Wirrwarr."
            />
            <FaqItem
              question="Muss ich danach trotzdem noch einen Energieberater beauftragen?"
              answer="Nur wenn es dein Vorhaben erfordert – das sagen wir dir im Ergebnisbericht."
            />
            <FaqItem
              question="Gibt es ein Upgrade zur Beratung?"
              answer="Ja, du kannst später problemlos zur Premium Plus Variante wechseln."
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
        <Title order={2} ta="center" mb="md">🔔 JETZT DURCHSTARTEN</Title>
        <Text ta="center" mb="lg" maw={800} mx="auto">
          ⏳ Zuschüsse verfallen oft – und Fehler kosten dich bares Geld. <br />
          🎯 Mit dem Premium-Check gehst du auf Nummer sicher. <br />
          👉 Starte jetzt mit dem Förderreport Premium für nur 59 €
        </Text>
        <Box ta="center">
          <Button
            size="xl"
            leftSection={<IconRocket size={24} />}
            component={Link}
            href="/foerdercheck"
          >
            Förderung prüfen & sicher beantragen
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}
