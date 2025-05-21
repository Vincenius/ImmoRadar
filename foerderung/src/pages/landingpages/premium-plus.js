import {
  Flex,
  Text,
  Title,
  Box,
  Blockquote,
  Accordion,
  List,
  ThemeIcon,
  Card,
  Table
} from '@mantine/core';
import Layout from '@/components/Layout/Layout';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import {
  IconCheck,
  IconQuote,
  IconDownload,
  IconUser,
  IconCalendar,
  IconDeviceLaptop,
  IconTargetArrow,
  IconRocket
} from '@tabler/icons-react';
import Button from '@/components/Inputs/ButtonMultiLine';

const FaqItem = ({ question, answer }) => (
  <Accordion.Item value={question}>
    <Accordion.Control><b>{question}</b></Accordion.Control>
    <Accordion.Panel>{answer}</Accordion.Panel>
  </Accordion.Item>
);

export default function FoerdercheckPremiumPlus() {
  return (
    <Layout
      title="Fördercheck Premium Plus – Persönliche Beratung & Förderstrategie"
      description="Mit dem Premium Plus Paket erhältst du persönliche Beratung durch Förder- und Finanzexpert:innen."
    >
      {/* HERO SECTION */}
      <Box className={styles.header} py="xl">
        <div className={styles.background}></div>
        <Flex mih="calc(100vh - 70px - 64px)" direction="column" justify="center">
          <Title fw="lighter" className={styles.title} mb="md">
            Wieviel Haus kannst du dir wirklich leisten – mit allen Förderungen?
          </Title>
          <Title order={2} size="h4" fw="normal" mb="lg">
            Mit dem Premium Plus Paket erhältst du eine persönliche Online-Beratung mit einem unserer Förder- & Finanzexperten. Gemeinsam analysieren wir dein Vorhaben und erstellen eine exklusive Strategie – von der Förderübersicht bis zur Antragstellung.
          </Title>
          <List spacing="xs">
            <List.Item icon={<IconDeviceLaptop size={18} />}>1:1-Beratung via Microsoft Teams</List.Item>
            <List.Item icon={<IconTargetArrow size={18} />}>Individuelle Finanzübersicht + Förderstrategie</List.Item>
            <List.Item icon={<IconDownload size={18} />}>Unterstützung bis zur Auszahlung</List.Item>
          </List>
          <Button maw="500px" mt="xl" size="xl" component={Link} href="/foerdercheck" leftSection={<IconUser size={24} />}>Persönliche Förderberatung buchen – 199 €</Button>
        </Flex>
      </Box>

      {/* FÜR WEN */}
      <Box py="6em">
        <Card shadow="md" radius="md" p="xl" withBorder maw={800} mx="auto">
          <Title order={2} ta="center" mb="md">Für wen ist die Premium Plus Beratung gedacht?</Title>
          <List spacing="lg" center icon={<ThemeIcon color="green.9" variant="light" size={24} radius="xl"><IconCheck size={16} /></ThemeIcon>} maw={600} mx="auto">
            <List.Item>…du planst zu bauen, zu kaufen oder umfassend zu sanieren</List.Item>
            <List.Item>…du willst auf Nummer sicher gehen bei Finanzierung & Förderung</List.Item>
            <List.Item>…du möchtest von Anfang bis Ende begleitet werden</List.Item>
            <List.Item>…du willst wissen, was realistisch möglich ist – und was nicht</List.Item>
          </List>
        </Card>
      </Box>

      {/* VORTEILE */}
      <Box py="6em" bg="gray.0">
        <Card radius="md" py="3em" bg="cyan.0">
          <Title order={2} ta="center" mb="md">Dein Premium-Vorteil gegenüber anderen Paketen</Title>
          <List spacing="md" center maw={600} mx="auto" icon={<IconCheck size={20} />}>
            <List.Item>Maßgeschneiderte Förderstrategie</List.Item>
            <List.Item>Realistische Finanzübersicht – du weißt, was du dir leisten kannst</List.Item>
            <List.Item>Persönliche Konzepterstellung für dein Projekt</List.Item>
            <List.Item>Unterstützung bei Antragstellung bis zur Auszahlung</List.Item>
            <List.Item>Auf Wunsch: Vernetzung mit geprüften Energieberater:innen</List.Item>
          </List>
          <Text mt="lg" ta="center" fs="italic">Du bringst das Projekt – wir die Struktur, Klarheit und Umsetzungskraft.</Text>
        </Card>
      </Box>

      {/* STIMMEN */}
      <Box py="6em">
        <Title order={2} ta="center" mb="xl">Stimmen unserer Kund:innen</Title>
        <Flex direction={{ base: 'column', sm: 'row' }} gap="xl" justify="center">
          <Blockquote icon={<IconQuote />} radius="sm" color="cyan" cite="– Sabine & Tom, Leipzig">
            Ich hätte nie gedacht, dass wir uns doch ein Eigenheim leisten können – durch die persönliche Beratung hatten wir plötzlich eine klare Perspektive.
          </Blockquote>
          <Blockquote icon={<IconQuote />} radius="sm" color="cyan" cite="– Michael B., Alleinverdiener & Sanierer">
            Die Antragstellung wurde für uns übernommen, und bei Fragen hatten wir immer einen Ansprechpartner – das war echte Erleichterung.
          </Blockquote>
        </Flex>
      </Box>

      {/* ABLAUF */}
      <Box py="6em" bg="gray.0">
        <Card shadow="md" radius="md" p="xl" withBorder maw={800} mx="auto">
          <Title order={2} ta="center" mb="xl">So läuft deine Premium Plus Beratung ab</Title>
          <List spacing="md" center maw={600} mx="auto" icon={<IconCalendar size={20} />}>
            <List.Item>Fördercheck Premium starten</List.Item>
            <List.Item>Termin vereinbaren für dein 1:1-Beratungsgespräch (per Microsoft Teams)</List.Item>
            <List.Item>Analyse deiner Finanzlage & Projektabsicht</List.Item>
            <List.Item>Erstellung deiner individuellen Förderstrategie</List.Item>
            <List.Item>Antragstellung & Begleitung bis zur Auszahlung</List.Item>
          </List>
          <Text mt="lg" ta="center" fs="italic">➡️ Du bekommst Klarheit, Sicherheit und persönliche Unterstützung – statt Formularchaos & Internetrecherche.</Text>
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
            <Table.Tr><Table.Td>Antragstellung & Begleitung</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Vernetzung mit Energieberater:innen</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>Individuelle Konzepterstellung für dein Projekt</Table.Td><Table.Td>✅ Ja</Table.Td></Table.Tr>
          </Table.Tbody>
        </Table>

        <Text ta="center" mt="md">💶 Jetzt zum Komplettpreis: 199 € (einmalig, kein Abo)</Text>

        <Box ta="center" mt="md">
          <Button size="lg" leftSection={<IconRocket size={24} />} component={Link} href="/foerdercheck">
            Jetzt Fördercheck Premium Plus starten
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
              answer="Du sprichst mit einem erfahrenen Förder- & Finanzexperten. Wir analysieren deine Situation, kalkulieren realistische Möglichkeiten und leiten daraus deine persönliche Förderstrategie ab – inkl. aller nächsten Schritte."
            />
            <FaqItem
              question="Wer übernimmt die Antragstellung?"
              answer="Unser Team kümmert sich auf Wunsch um alle Formalitäten. Du erhältst zudem Hinweise, wo du unterzeichnen musst oder welche Dokumente du brauchst."
            />
            <FaqItem
              question="Was, wenn ich noch unsicher bin?"
              answer="Kein Problem – unser Beratungsgespräch ist offen, ehrlich und individuell. Du entscheidest danach, wie du weitergehst."
            />
          </Accordion>
        </Box>
      </Box>

      {/* ABSCHLUSS CTA */}
      <Box py="6em" pos="relative">
        <div className={styles.background}></div>
        <Title order={2} ta="center" mb="md">🔔 ES GEHT UM DEINE ZUKUNFT</Title>
        <Text ta="center" mb="lg" maw={800} mx="auto">
          🏠 Der Weg ins Eigenheim ist oft komplex – aber du musst ihn nicht allein gehen. <br />
          🎯 Lass uns gemeinsam dein Projekt auf sichere Beine stellen – mit Strategie, Struktur und persönlicher Begleitung. <br />
          👉 Jetzt Fördercheck Premium Plus starten und mit Klarheit loslegen
        </Text>
        <Box ta="center">
          <Button
            size="xl"
            component={Link}
            leftSection={<IconRocket size={24} />}
            href="/foerdercheck"
          >
            Beratung starten – 199 € investieren, Tausende sparen
          </Button>
        </Box>
      </Box>

    </Layout>
  );
}
