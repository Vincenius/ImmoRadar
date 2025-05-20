import {
  Flex,
  Text,
  Button,
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
import { IconCheck, IconQuote, IconDownload, IconSearch, IconShoppingCart, IconAlertTriangle } from '@tabler/icons-react';

const FaqItem = ({ question, answer }) => (
  <Accordion.Item value={question}>
    <Accordion.Control><b>{question}</b></Accordion.Control>
    <Accordion.Panel>{answer}</Accordion.Panel>
  </Accordion.Item>
);

export default function FoerdercheckStarter() {
  return (
    <Layout
      title="Fördercheck Starter – Alle Zuschüsse auf einen Blick"
      description="Für nur 39 € bekommst du eine individuell sortierte Übersicht deiner Fördermöglichkeiten – sofort als PDF."
    >
      {/* HERO SECTION */}
      <Box className={styles.header} py="xl">
        <div className={styles.background}></div>
        <Flex mih="calc(100vh - 70px - 64px)" direction="column" justify="center">
          <Title fw="lighter" className={styles.title} mb="md">
            Du willst bauen, sanieren oder modernisieren – aber keine Förderung verpassen?
          </Title>
          <Title order={2} size="h4" fw="normal" mb="lg">
            Mit dem Starter-Fördercheck bekommst du in wenigen Minuten Klarheit über alle Zuschüsse, die wirklich zu deinem Projekt passen.
            Ohne Bürokratie, ohne Vorwissen – einfach starten und sparen.
          </Title>
          <List spacing="xs">
            <List.Item icon={<IconCheck size={18} />}>Fördermittel einfach finden</List.Item>
            <List.Item icon={<IconCheck size={18} />}>Persönlicher Ergebnisbericht</List.Item>
            <List.Item icon={<IconCheck size={18} />}>Für Bau, Sanierung, Heizung, PV & mehr</List.Item>
          </List>
          <Button maw="400px" mt="xl" size="xl" component={Link} href="/foerdercheck" leftSection={<IconSearch size={24} />}>Jetzt Fördercheck machen</Button>
        </Flex>
      </Box>

      {/* WAS DU BEKOMMST */}
      <Box py="6em">
        <Card shadow="md" radius="md" p="xl" withBorder maw={800} mx="auto">
          <Title order={2} ta="center" mb="md">Was du bekommst</Title>
          <Text ta="center" mb="xl">Der Fördercheck Starter ist perfekt für dich, wenn du...</Text>
          <List spacing="lg" center icon={<ThemeIcon color="cyan.9" variant="light" size={24} radius="xl"><IconCheck size={16} /></ThemeIcon>} maw={600} mx="auto">
            <List.Item>…dir einen ersten Überblick verschaffen willst</List.Item>
            <List.Item>…Zuschüsse nicht verpassen möchtest</List.Item>
            <List.Item>…einfach & schnell herausfinden willst, was dir zusteht</List.Item>
          </List>

          <Divider my="xl" label="Du bekommst" />

          <Box ta="center">
            <List spacing="md" center icon={<IconDownload size={18} />} maw={600} mx="auto">
              <List.Item>Eine sortierte Übersicht aller passenden Förderprogramme</List.Item>
              <List.Item>Individuell auf dein Vorhaben und deine Region abgestimmt</List.Item>
              <List.Item>Sofort zum Download – kein Warten, kein Abo</List.Item>
            </List>
          </Box>
        </Card>
      </Box>

      {/* WARUM SINNVOLL */}
      <Box py="6em">
        <Card bg="cyan.0" radius="md" py="3em">
          <Title order={2} ta="center" mb="md">Warum das sinnvoll ist</Title>
          <Text ta="center" mb="lg" maw={800} mx="auto" fs="italic">
            In Deutschland gibt es über 5.000 Förderprogramme. Viele Bauherren und Sanierer wissen nicht, was davon zu ihrem Projekt passt – und verschenken so tausende Euro.
            Mit dem Fördercheck vermeidest du teure Fehler und erkennst alle relevanten Förderungen auf einen Blick.
          </Text>
        </Card>
      </Box>

      {/* STIMMEN */}
      <Box py="6em" pos="relative">
        <Box pos="absolute" w="100vw" h="100%" bg="white" left="50%" top="0" style={{ transform: 'translateX(-50%)', zIndex: -1 }}></Box>
        <Title order={2} ta="center" mb="xl">Stimmen unserer Nutzer</Title>
        <Flex direction={{ base: 'column', sm: 'row' }} gap="xl" justify="center">
          <Blockquote icon={<IconQuote />} radius="sm" color="cyan" cite="– Familie Meier, Hannover">
            Wir hätten fast 12.000 € verpasst – durch den Check wussten wir endlich, was wir beantragen können.
          </Blockquote>
          <Blockquote icon={<IconQuote />} radius="sm" color="cyan" cite="– Bauherrin Laura, Köln">
            Super verständlich! In 5 Minuten hatten wir eine klare Liste mit Zuschüssen für unsere Sanierung.
          </Blockquote>
        </Flex>
      </Box>

      {/* SO FUNKTIONIERT'S */}
      <Box py="6em" bg="gray.0">
        <Card shadow="md" radius="md" p="xl" withBorder maw={800} mx="auto">
          <Title order={2} ta="center" mb="xl">So funktioniert’s</Title>
          <List mb="lg" spacing="md" center maw={600} mx="auto" icon={<IconCheck size={20} />}>
            <List.Item>Fragen beantworten – dein Projekt, deine Region, deine Pläne</List.Item>
            <List.Item>Check durchführen – mit unserem digitalen Tool</List.Item>
            <List.Item>Ergebnis erhalten – als PDF-Report direkt per E-Mail</List.Item>
          </List>
          <Text mt="lg" ta="center" fs="italic">➡️ Du weißt sofort, welche Förderungen zu dir passen – ohne stundenlange Recherche.</Text>
        </Card>
      </Box>

      {/* PAKETINHALT */}
      <Box py="6em" pos="relative">
        <Title order={2} ta="center" mb="xl">Das Paket „Starter“ auf einen Blick</Title>

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
            <Table.Tr><Table.Td>Kurze Erklärtexte zu Programmen</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Energieberater-Abgleich</Table.Td><Table.Td>❌ Nicht enthalten</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Schritt-für-Schritt-Anleitung</Table.Td><Table.Td>❌ Nicht enthalten</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Persönliche Beratung</Table.Td><Table.Td>❌ Nicht enthalten</Table.Td></Table.Tr>
          </Table.Tbody>
        </Table>
        <Text ta="center" mt="md">✅ Ideal für alle, die eigenständig handeln möchten.</Text>
        <Text ta="center" mb="md">💶 Nur 39 € – einmalig, kein Abo, keine versteckten Kosten</Text>
        <Box ta="center">
          <Button size="lg" leftSection={<IconShoppingCart size={24} />} component={Link} href="/foerdercheck">Jetzt Fördercheck Starter kaufen</Button>
        </Box>
      </Box>

      {/* FAQ */}
      <Box py="6em" pos="relative">
        <Box pos="absolute" w="100vw" h="100%" bg="white" left="50%" top="0" style={{ transform: 'translateX(-50%)', zIndex: -1 }}></Box>
        <Title order={2} ta="center" mb="xl">Häufige Fragen</Title>
        <Box maw="600px" m="0 auto">
          <Accordion bg="gray.0" radius="md" withBorder>
            <FaqItem
              question="Was ist, wenn ich keine Förderung finde?"
              answer="Unser System erkennt über 500 Programme – sollte ausnahmsweise keine passende Förderung vorhanden sein, sagen wir dir das ehrlich."
            />
            <FaqItem
              question="Wie schnell bekomme ich mein Ergebnis?"
              answer="Direkt nach dem Check – du erhältst sofort deinen persönlichen Report per E-Mail."
            />
            <FaqItem
              question="Was ist, wenn ich später doch Beratung will?"
              answer="Kein Problem – du kannst jederzeit auf Premium oder Premium Plus upgraden."
            />
          </Accordion>
        </Box>
      </Box>

      {/* ABSCHLUSS CTA */}
      <Box py="6em" pos="relative">
        <div className={styles.background}></div>
        <Title order={2} ta="center" mb="md">Jetzt deinen Vorteil sichern</Title>
        <Text ta="center" mb="lg" maw={800} mx="auto">
          Fördermittel sind oft zeitlich oder budgetär begrenzt. Wer zu spät kommt, schaut in die Röhre – also lieber jetzt Klarheit schaffen.
        </Text>
        <Box ta="center">
          <Button size="xl" leftSection={<IconAlertTriangle size={24} />} component={Link} href="/foerdercheck">Jetzt mit dem Fördercheck Starter starten</Button>
        </Box>
      </Box>
    </Layout>
  );
}