import Layout from '@/components/Layout/Layout'
import { Title, Flex, Box, Blockquote, Card, Text, List, ThemeIcon } from '@mantine/core'
import Link from 'next/link'
import { IconInfinity, IconUserShield, IconPencil, IconFileText, IconSearch, IconMessage2, IconTools, IconCheck, IconLock, IconCertificate, IconStars, IconFolders, IconArrowRight, IconMoneybagMinus } from '@tabler/icons-react'
import styles from '@/styles/Home.module.css'
import Button from '@/components/Inputs/ButtonMultiLine';
import QuoteSlider from '@/components/QuoteSlider/QuoteSlider'

function AboPage() {
  return (
    <Layout
      title="Mietverträge unbegrenzt erstellen – mit dem Jahresabo"
      noPadding
      description="Dein Mietvertragstool für ein ganzes Jahr – für nur 69,99 € jährlich. Ideal für Vermieter:innen, Eigentümer:innen und Hausverwaltungen.">

      <Box my={{ base: '4em', sm: '8em' }}>
        <Title mb="md" fw="lighter" className={styles.title}>
          🔁 Mietverträge unbegrenzt erstellen – mit dem Jahresabo
        </Title>
        <Text mb="3em" fw="normal" w="70%">
          <b>Dein Mietvertragstool für ein ganzes Jahr – für nur 69,99 € jährlich!</b><br />
          Erstelle so viele Mietverträge, wie du brauchst – jederzeit. Passe bestehende Verträge flexibel an. Alles sicher in deinem persönlichen Account gespeichert.<br /><br />
          Ideal für Vermieter:innen mit mehreren Mietverhältnissen, Eigentümer:innen, Hausverwaltungen oder alle, die regelmäßig Verträge erstellen.
        </Text>
        <Button component={Link} href="/registrieren" size="lg" mb="xs">Jahresabo für 69,99 € starten</Button>
        <Text fs="italic" size="sm">Jederzeit kündbar</Text>
      </Box>

      <Box py="6em" pos="relative">
        <Box className={styles.skewed} />
        <Card shadow="md" radius="md" p="xl" withBorder maw={800} mx="auto">
          <Title order={2} mb="xl" ta="center">✅ Was du bekommst</Title>
          <List spacing="lg" size="md" icon={<ThemeIcon color="green" radius="xl"><IconCheck size={16} /></ThemeIcon>}>
            <List.Item icon={<IconInfinity size={20} />}>Unbegrenzte Generierung von Mietverträgen – so oft du willst</List.Item>
            <List.Item icon={<IconUserShield size={20} />}>Sicherer Zugang zu deinem persönlichen Account – alle Verträge jederzeit verfügbar</List.Item>
            <List.Item icon={<IconPencil size={20} />}>Bestehende Verträge jederzeit anpassbar & erneut generierbar</List.Item>
            <List.Item icon={<IconFileText size={20} />}>Alle Vertragsarten inklusive: Wohnraummiete, Zwischenmiete, WG, Staffelmiete u.v.m.</List.Item>
            <List.Item icon={<IconSearch size={20} />}>Rechtlich geprüft & regelmäßig aktualisiert</List.Item>
            <List.Item icon={<IconMessage2 size={20} />}>Einfache Sprache & intuitive Bedienung</List.Item>
            <List.Item icon={<IconTools size={20} />}>Zugang zu exklusiven Vorlagen & Zusatzvereinbarungen</List.Item>
          </List>
        </Card>
      </Box>

      <Box py="6em" pos="relative">
        <Card pos="relative" bg="var(--mantine-color-gray-0)" radius="md" maw={800} mx="auto" p="xl" withBorder shadow="md">
          <Title order={2} ta="center" mb="xl">🚀 Für wen ist das Abo gemacht?</Title>
          <List spacing="lg" icon={<ThemeIcon color="cyan" radius="xl"><IconCheck size={16} /></ThemeIcon>}>
            <List.Item>…regelmäßig vermietest oder mehrere Mietverhältnisse betreust</List.Item>
            <List.Item>…Verträge flexibel anpassen und speichern möchtest</List.Item>
            <List.Item>…alle Dokumente zentral & sicher verwalten willst</List.Item>
            <List.Item>…eine smarte Lösung statt veralteter Word-Dokumente suchst</List.Item>
          </List>
        </Card>
      </Box>

      <Box py="6em" pos="relative">
        <Title order={2} ta="center" mb="xl">💬 Stimmen zufriedener Nutzer:innen</Title>
        <QuoteSlider quotes={[
          {
            text: "„Ich habe drei Wohnungen zur Vermietung – mit dem Abo spare ich nicht nur Zeit, sondern habe alle Verträge immer griffbereit und kann sie flexibel anpassen.“",
            author: "– Martin F., Jahresabo"
          },
          {
            text: "„Vorher war das ein Chaos mit verschiedenen Word-Dokumenten. Jetzt ist alles an einem Ort, und ich muss keine neue Vorlage mehr suchen.“",
            author: "– Daniela S., Jahresabo"
          },
          {
            text: "„Rechtssicherheit ist mir wichtig – besonders bei Staffel- oder Indexmieten. Dank des Abos bin ich immer auf dem aktuellen Stand.“",
            author: "– Uwe T., Jahresabo"
          },
          {
            text: "„Ich nutze den Generator regelmäßig für WG-Verträge – besonders praktisch, dass ich alte Verträge einfach duplizieren und anpassen kann.“",
            author: "– Sina M., Jahresabo"
          },
          {
            text: "„Jede Vertragsänderung ist mit wenigen Klicks erledigt. Kein Papierchaos mehr, keine Rechtsunsicherheit. Das Abo lohnt sich total.“",
            author: "– Claudia H., Jahresabo"
          }
        ]} />

      </Box>

      <Box py="6em" pos="relative" mb="4em">
        <Card shadow="md" radius="md" p="xl" withBorder maw={800} mx="auto">
          <Title order={2} ta="center" mb="xl">🔐 Sicherheit & Komfort</Title>
          <List spacing="lg" size="md" icon={<ThemeIcon color="gray" radius="xl"><IconLock size={16} /></ThemeIcon>}>
            <List.Item icon={<IconLock size={20} />}>DSGVO-konform – deine Daten bleiben geschützt</List.Item>
            <List.Item icon={<IconCertificate size={20} />}>Juristisch geprüft – regelmäßige Updates bei Gesetzesänderungen</List.Item>
            <List.Item icon={<IconFolders size={20} />}>Digitale Organisation leicht gemacht – alle Verträge auf einen Blick</List.Item>
          </List>
        </Card>
      </Box>

      <Box py="6em" pos="relative">
        <Box className={styles.lightPattern}></Box>
        <Title order={2} ta="center" mb="md">💸 Dein Preis: 69,99 €/Jahr</Title>
        <Text ta="center" mb="xl">
          Keine Begrenzung. Keine Extra-Kosten. Kein Papierkram.<br />
          Nur 5,83 € pro Monat – für grenzenlose Sicherheit & Effizienz.
        </Text>

        <Flex justify="center">
          <Button size="xl" component={Link} href="/registrieren" rightSection={<IconArrowRight size={18} />}>
            Jahresabo für 69,99 € starten
          </Button>
        </Flex>
      </Box>

    </Layout>
  )
}

export default AboPage
