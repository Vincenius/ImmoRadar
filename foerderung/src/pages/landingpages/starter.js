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
import { IconCheck, IconDownload, IconSearch, IconShoppingCart, IconRocket } from '@tabler/icons-react';
import Button from '@/components/Inputs/ButtonMultiLine';
import QuoteSlider from '@/components/QuoteSlider/QuoteSlider';

const FaqItem = ({ question, answer }) => (
  <Accordion.Item value={question}>
    <Accordion.Control><b>{question}</b></Accordion.Control>
    <Accordion.Panel>{answer}</Accordion.Panel>
  </Accordion.Item>
);

export default function FoerdercheckStarter() {
  return (
    <Layout
      title="Förderreport Starter – Alle Zuschüsse auf einen Blick"
      description="Für nur 39 € bekommst du eine individuell sortierte Übersicht deiner Fördermöglichkeiten – sofort als PDF."
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
            Du willst bauen, sanieren oder modernisieren – aber keine Förderung verpassen?
          </Title>
          <Title order={2} size="h4" fw="normal" mb="lg">
            Mit dem Starter-Förderreport bekommst du in wenigen Minuten Klarheit über alle Zuschüsse, die wirklich zu deinem Projekt passen.
            Ohne Bürokratie, ohne Vorwissen – einfach starten und sparen.
          </Title>
          <List spacing="xs">
            <List.Item icon={<IconCheck size={18} />}>Fördermittel einfach finden</List.Item>
            <List.Item icon={<IconCheck size={18} />}>Persönlicher Ergebnisbericht</List.Item>
            <List.Item icon={<IconCheck size={18} />}>Für Bau, Sanierung, Heizung, PV & mehr</List.Item>
          </List>
          <Button maw="400px" mt="xl" size="xl" component={Link} href="/foerdercheck" leftSection={<IconSearch size={24} />}>Jetzt Förderreport erstellen – 39 €</Button>
        </Flex>
      </Box>

      {/* WAS DU BEKOMMST */}
      <Box py="6em">
        <Card shadow="md" radius="md" p="xl" withBorder maw={800} mx="auto">
          <Title order={2} ta="center" mb="md">Was du bekommst</Title>
          <Text ta="center" mb="xl">Der Förderreport Starter ist perfekt für dich, wenn du...</Text>
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
        <Title order={2} ta="center" mb="xl">Stimmen unserer Nutzer</Title>

        <QuoteSlider quotes={[
          {
            text: "„Wir hätten fast 7.000 € übersehen bei unserer Altbausanierung – der Bericht war mega übersichtlich und kam sofort per Mail.“",
            author: "– Carsten W., Sanierung"
          },
          {
            text: "„In 10 Minuten hatten wir Klarheit für unseren Neubau: Welche Programme, wie viel Förderung, was kombinierbar ist – das war jeden Cent wert.“",
            author: "– Nina M., Neubau"
          },
          {
            text: "„Ich hatte vorher schon recherchiert, aber die Struktur hier hat mir bestimmt zwei Tage Arbeit abgenommen.“",
            author: "– David P., Sanierung"
          },
          {
            text: "„Ohne den Starter-Check hätten wir das 5.000 € Zuschussprogramm der Stadt total verpasst. Jetzt ist’s fix beantragt.“",
            author: "– Sandra K., Sanierung"
          },
          {
            text: "„Wir wollten es selbst in die Hand nehmen – der Förderreport Starter hat uns sofort das richtige Fundament gegeben.“",
            author: "– Jonas H., Neubau"
          },
          {
            text: "„Die Einschätzung kam direkt, war leicht verständlich und hat uns auf ein Programm gebracht, das wir gar nicht auf dem Schirm hatten – 6.300 € gesichert.“",
            author: "– Elena & Mark T., Sanierung"
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
            <List mb="xl" spacing="md" center maw={600} mx="auto" icon={<IconCheck size={20} />}>
              <List.Item>Fragen beantworten – dein Projekt, deine Region, deine Pläne</List.Item>
              <List.Item>Check durchführen – mit unserem digitalen Tool</List.Item>
              <List.Item>Ergebnis erhalten – als PDF-Report direkt per E-Mail</List.Item>
            </List>
            <Text mt="lg" ta="center" fs="italic">➡️ Du weißt sofort, welche Förderungen zu dir passen – ohne stundenlange Recherche.</Text>
          </Card.Section>
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
          <Button size="lg" leftSection={<IconShoppingCart size={24} />} component={Link} href="/foerdercheck">Jetzt Förderreport Starter kaufen</Button>
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
        <Title order={2} ta="center" mb="md">Jetzt deinen Vorteil sichern</Title>
        <Text ta="center" mb="lg" maw={800} mx="auto">
          📋 Schneller Überblick über passende Förderungen.<br />
          💡 Ideal für alle, die sich selbst informieren wollen<br />
          👉 Erstelle jetzt den Förderreport Starter für nur 39 €
        </Text>
        <Box ta="center">
          <Button size="xl" leftSection={<IconRocket size={24} />} component={Link} href="/foerdercheck">Jetzt den Förderreport Starter erstellen</Button>
        </Box>
      </Box>
    </Layout>
  );
}