import {
  Flex,
  Text,
  Title,
  Box,
  Blockquote,
  Accordion,
  Divider,
  List,
  ThemeIcon,
  Table,
  Card
} from '@mantine/core';
import Layout from '@/components/Layout/Layout';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import {
  IconCheck,
  IconRocket,
  IconInfoCircle,
  IconClipboardText,
  IconDownload,
  IconSearch,
  IconAlertTriangle,
  IconQuote,
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
      title="Fördercheck Premium – Mit Schritt-für-Schritt-Anleitung zur Förderung"
      description="59 €, einmalig: Mit dem Premium-Fördercheck erhältst du nicht nur alle passenden Zuschüsse – sondern auch eine Anleitung zur erfolgreichen Antragstellung."
    >
      {/* HERO SECTION */}
      <Box className={styles.header} py="xl">
        <div className={styles.background}></div>
        <Flex mih="calc(100vh - 70px - 64px)" direction="column" justify="center">
          <Title fw="lighter" className={styles.title} mb="md">
            Du willst Förderung – aber keine Fehler machen?
          </Title>
          <Title order={2} size="h4" fw="normal" mb="lg">
            Mit dem Fördercheck Premium bekommst du nicht nur eine Liste aller passenden Zuschüsse – sondern auch eine verständliche Schritt-für-Schritt-Anleitung zur Umsetzung.
          </Title>
          <List spacing="xs">
            <List.Item icon={<IconCheck size={18} />}>Alle Zuschüsse auf einen Blick</List.Item>
            <List.Item icon={<IconCheck size={18} />}>Klare Anleitung für die nächsten Schritte</List.Item>
            <List.Item icon={<IconCheck size={18} />}>Ideal für alle, die nichts übersehen wollen</List.Item>
          </List>
          <Button maw="440px" mt="xl" size="xl" component={Link} href="/foerdercheck" leftSection={<IconRocket size={24} />}>
            Fördercheck Premium starten – 59 €
          </Button>
        </Flex>
      </Box>

      {/* WAS DU BEKOMMST */}
      <Box py="6em">
        <Card shadow="md" radius="md" p="xl" withBorder maw={800} mx="auto">
          <Title order={2} ta="center" mb="md">Was du bekommst</Title>
          <Text ta="center" mb="xl">Der Fördercheck Premium ist perfekt für dich, wenn du…</Text>
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

      {/* VORTEILE GEGENÜBER STARTER */}
      <Box py="6em" bg="gray.0">
        <Card radius="md" py="3em" maw={800} mx="auto" bg="cyan.0">
          <Title order={2} ta="center" mb="md">Dein Vorteil gegenüber der Starter-Version</Title>
          <Text ta="center" mb="lg" maw={700} mx="auto" fs="italic">
            Der Fördercheck Premium gibt dir nicht nur Infos – sondern auch Umsetzungssicherheit.
            Viele Förderprogramme scheitern an Formalitäten. Mit der Anleitung weißt du genau, was du tun musst.
            Sparen ist gut – aber Förderung auch zu bekommen ist besser.
          </Text>
          <Text ta="center" mb="lg" maw={700} mx="auto" fs="italic" fw="bold">Wer spart, denkt klug. Wer Förderungen nutzt, handelt klüger.</Text>
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
          }
        ]} />

      </Box>

      {/* SO FUNKTIONIERT'S */}
      <Box py="6em" bg="gray.0">
        <Card shadow="md" radius="md" p="xl" withBorder maw={800} mx="auto">
          <Title order={2} ta="center" mb="xl">So funktioniert’s</Title>
          <List mb="lg" spacing="md" center maw={600} mx="auto" icon={<IconCheck size={20} />}>
            <List.Item>Projekt eingeben – wenige Klicks, keine Vorkenntnisse</List.Item>
            <List.Item>Premium-Check durchführen – Analyse durch unsere Datenbank</List.Item>
            <List.Item>Ergebnis & Anleitung erhalten – beides direkt per E-Mail</List.Item>
          </List>
          <Text mt="lg" ta="center" fs="italic">➡️ Danach weißt du genau, welche Förderung passt – und wie du sie richtig beantragst.</Text>
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
          <Button size="lg" leftSection={<IconRocket size={24} />} component={Link} href="/foerdercheck">Jetzt Fördercheck Premium starten</Button>
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
        <div className={styles.background}></div>
        <Title order={2} ta="center" mb="md">🔔 JETZT DURCHSTARTEN STATT ZAUDERN</Title>
        <Text ta="center" mb="lg" maw={800} mx="auto">
          ⏳ Zuschüsse verfallen oft – und Fehler kosten dich bares Geld. <br />
          🎯 Mit dem Premium-Check gehst du auf Nummer sicher. <br />
          👉 Starte jetzt mit dem Fördercheck Premium für nur 59 €
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
