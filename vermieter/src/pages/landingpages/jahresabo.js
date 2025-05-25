import Layout from '@/components/Layout/Layout'
import { Title, Flex, Box, Blockquote, Card, Text, List, ThemeIcon } from '@mantine/core'
import Link from 'next/link'
import { IconInfinity, IconUserShield, IconPencil, IconFileText, IconSearch, IconMessage2, IconTools, IconCheck, IconLock, IconCertificate, IconStars, IconFolders, IconArrowRight, IconMoneybagMinus } from '@tabler/icons-react'
import styles from '@/styles/Home.module.css'
import Button from '@/components/Inputs/ButtonMultiLine';

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
        <Button component={Link} href="/registrieren" size="lg" mb="md">Jahresabo für 69,99 € starten</Button>
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
            <List.Item icon={<IconMoneybagMinus size={20} />}>Jederzeit kündbar</List.Item>
          </List>
        </Card>
      </Box>

      <Box py="6em" pos="relative">
        <Card pos="relative" bg="var(--mantine-color-gray-0)" radius="md" maw={800} mx="auto" p="xl" withBorder shadow="md">
          <Title order={2} ta="center" mb="xl">🚀 Für wen ist das Abo gemacht?</Title>
          <List spacing="lg" icon={<ThemeIcon color="blue" radius="xl"><IconCheck size={16} /></ThemeIcon>}>
            <List.Item>…regelmäßig vermietest oder mehrere Mietverhältnisse betreust</List.Item>
            <List.Item>…Verträge flexibel anpassen und speichern möchtest</List.Item>
            <List.Item>…alle Dokumente zentral & sicher verwalten willst</List.Item>
            <List.Item>…eine smarte Lösung statt veralteter Word-Dokumente suchst</List.Item>
          </List>
        </Card>
      </Box>

      <Box py="6em" pos="relative">
        <Title order={2} ta="center" mb="xl">💬 Stimmen zufriedener Nutzer:innen</Title>
        <Flex gap="4em" direction={{ base: 'column', xs: 'row' }}>
          <Blockquote icon={<IconStars />} radius="sm" color="cyan" cite="– Sven T., Immobilienbesitzer" w="100%" styles={{ root: { backgroundColor: 'var(--mantine-primary-color-0)' } }}>
            „Ich habe drei Mietwohnungen und endlich alles an einem Ort. Kein Nachfragen mehr – einfach erstellen, anpassen, fertig.“
          </Blockquote>

          <Blockquote icon={<IconStars />} radius="sm" color="cyan" cite="– Mia K., WG-Verwalterin" w="100%" styles={{ root: { backgroundColor: 'var(--mantine-primary-color-0)' } }}>
            „Für unsere WG-Wechsel ideal. Einloggen, alten Vertrag kopieren, Daten ändern – fertig. Spart so viel Zeit!“
          </Blockquote>
        </Flex>
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
