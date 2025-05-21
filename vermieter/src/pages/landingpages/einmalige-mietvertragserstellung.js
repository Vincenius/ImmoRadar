import Layout from '@/components/Layout/Layout'
import { Title, Flex, Box, Blockquote, Card, Text, List, ThemeIcon } from '@mantine/core'
import Link from 'next/link'
import { IconDownload, IconFileText, IconChecklist, IconArrowRight, IconCheck, IconUser, IconLock, IconCertificate, IconPaperclip, IconQuote } from '@tabler/icons-react'
import styles from '@/styles/Home.module.css'
import Button from '@/components/Inputs/ButtonMultiLine';

function Landingpage() {
  return (
    <Layout
      title="Einmalige Mietvertragserstellung – Schnell. Sicher. Verständlich."
      description="Erstelle in wenigen Minuten deinen rechtssicheren Mietvertrag zum Sofort-Download – ohne Juristendeutsch, ohne Wartezeit, ohne Abo. Ideal für WG, Zwischenmiete oder klassische Vermietung."
      noPadding
    >
      <Box my={{ base: '4em', sm: '8em' }}>
        <Title mb="md" fw="lighter" className={styles.title}>
          🔑 Einmalige Mietvertragserstellung – Schnell. Sicher. Verständlich.
        </Title>
        <Text mb="3em" fw="normal" w="70%">
          <b>Dein rechtssicherer Mietvertrag zum Sofort-Download – für nur 5,99 €!</b><br />
          Erstelle in wenigen Minuten deinen <b>individuellen Mietvertrag</b> – ohne Juristendeutsch, ohne Wartezeit, ohne Abo.<br /><br />
          Ideal für alle, die nur gelegentlich vermieten – ob WG, Zwischenmiete oder klassischer Mietvertrag: Mit unserem digitalen Generator erhältst du ein rechtlich geprüftes Dokument, das passt.
        </Text>
        <Button component={Link} href="/mietvertrag-generator" size="lg" mb="md">Mietvertrag für 5,99 € erstellen</Button>

      </Box>

      <Box py="6em" pos="relative">
        <Box className={styles.skewed} />

        <Card shadow="md" radius="md" p="xl" withBorder maw={800} mx="auto">
          <Title order={2} mb="xl" ta="center">✅ Was du bekommst</Title>
          <List spacing="lg" size="md" icon={<ThemeIcon color="green" radius="xl"><IconCheck size={16} /></ThemeIcon>}>
            <List.Item icon={<IconFileText size={20} />}>Einen individuellen, rechtssicheren Mietvertrag</List.Item>
            <List.Item icon={<IconDownload size={20} />}>Download als PDF – direkt nach der Erstellung</List.Item>
            <List.Item icon={<IconChecklist size={20} />}>Angepasst auf dein Mietverhältnis – Fragen beantworten, Vertrag erhalten</List.Item>
            <List.Item icon={<IconCertificate size={20} />}>Rechtlich geprüft – kein Risiko, keine veralteten Vorlagen</List.Item>
            <List.Item icon={<IconUser size={20} />}>Einfache Sprache – verständlich auch ohne juristische Vorkenntnisse</List.Item>
          </List>
        </Card>
      </Box>

      <Box py="6em" pos="relative">
        <Card pos="relative" bg="var(--mantine-color-gray-0)" radius="md" maw={800} mx="auto" p="xl" withBorder shadow="md">
          <Title order={2} ta="center" mb="xl">🧠 Für wen ist diese Variante ideal?</Title>

          <List spacing="lg" icon={<ThemeIcon color="blue" radius="xl"><IconCheck size={16} /></ThemeIcon>}>
            <List.Item>…nur einmalig oder gelegentlich vermietest</List.Item>
            <List.Item>…eine sofort einsetzbare Vertragsvorlage suchst</List.Item>
            <List.Item>…keine Lust auf Abo-Modelle oder unnötige Extras hast</List.Item>
            <List.Item>…einfach & sicher vermieten möchtest</List.Item>
          </List>
        </Card>
      </Box>

      <Box py="6em" pos="relative">
        <Title order={2} ta="center" mb="xl">💬 Was unsere Nutzer:innen sagen</Title>

        <Flex gap="4em" direction={{ base: 'column', xs: 'row' }}>
          <Blockquote icon={<IconQuote />} radius="sm" color="cyan" cite="– Michael G., privater Vermieter" w="100%" styles={{ root: { backgroundColor: 'var(--mantine-primary-color-0)' } }}>
            „Endlich kein Rätselraten mehr. In 10 Minuten hatte ich meinen Vertrag – und mein Mieter war direkt zufrieden.“
          </Blockquote>

          <Blockquote icon={<IconQuote />} radius="sm" color="cyan" cite="– Aylin K., Zwischenmieterin in Köln" w="100%" styles={{ root: { backgroundColor: 'var(--mantine-primary-color-0)' } }}>
            „Ich hatte keine Ahnung, was in einen WG-Vertrag gehört. Der Generator hat mir alles super erklärt.“
          </Blockquote>
        </Flex>
      </Box>

      <Box py="6em" pos="relative" mb="4em">
        <Card shadow="md" radius="md" p="xl" withBorder maw={800} mx="auto">
          <Title order={2} ta="center" mb="xl">🔐 Sicher & vertraulich</Title>

          <List spacing="lg" size="md" icon={<ThemeIcon color="gray" radius="xl"><IconLock size={16} /></ThemeIcon>}>
            <List.Item icon={<IconLock size={20} />}>DSGVO-konform – Deine Daten bleiben bei dir</List.Item>
            <List.Item icon={<IconCertificate size={20} />}>Juristisch geprüft – Entwickelt mit Fachanwälten</List.Item>
            <List.Item icon={<IconPaperclip size={20} />}>Sofort einsetzbar – Kein Warten, kein Versand, kein Papierkram</List.Item>
          </List>
        </Card>
      </Box>

      <Box py="6em" pos="relative">
        <Box className={styles.lightPattern}></Box>
        <Title order={2} ta="center" mb="md">💸 Dein Preis: Nur 5,99 €</Title>
        <Text ta="center" mb="xl">Keine Folgekosten. Kein Abo. Keine versteckten Gebühren.<br />Du zahlst einmal – und erhältst sofort deinen Vertrag.</Text>

        <Flex justify="center">
          <Button size="xl" component={Link} href="/mietvertrag-generator" rightSection={<IconArrowRight size={18} />}>
            Mietvertrag für 5,99 € erstellen
          </Button>
        </Flex>
      </Box>
    </Layout>
  )
}

export default Landingpage
