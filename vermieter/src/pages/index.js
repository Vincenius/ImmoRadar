import Layout from '@/components/Layout/Layout'
import { Button, Title, Flex, Box, Blockquote, Card, Text, List, Accordion } from '@mantine/core'
import Link from 'next/link'
import { IconQuote } from '@tabler/icons-react'
import styles from '@/styles/Home.module.css'
import Pricing from '@/components/Pricing/Pricing'

const FaqItem = ({ question, answer }) => <Accordion.Item value={question}>
  <Accordion.Control><b>{question}</b></Accordion.Control>
  <Accordion.Panel>{answer}</Accordion.Panel>
</Accordion.Item>

function Home() {

  return (
    <Layout title="Mietvertrag Generator" noindex={true} noPadding description="Erstelle in wenigen Minuten einen rechtssicheren Mietvertrag online. Schnell, einfach und günstig. Ab nur 1€ pro Vertrag oder unbegrenzt mit dem Jahresabo für 9,50€. Jetzt starten und Zeit sparen!">
      <Box my={{ base: '4em', sm: '8em' }}>
        {/* https://mantine.dev/core/transition/ */}
        <Title mb="md" fw="lighter" className={styles.title}>Erstelle deinen individuellen Mietvertrag in nur wenigen Minuten!</Title>
        <Title order={2} size="h5" mb="3em" fw="normal" w="70%">
          <b>Schnell, einfach und rechtssicher</b> - Unser einfacher Generator führt dich Schritt für Schritt durch den Prozess, damit du schnell und unkompliziert einen rechtssicheren Vertrag erhältst.
        </Title>
        <Button component={Link} href="/mietvertrag-generator" size="lg">Jetzt Mietvertrag erstellen</Button>
      </Box>
      <Box py="6em" pos="relative">
        <Box className={styles.skewed} />

        <Flex gap="4em" direction={{ base: 'column', xs: 'row' }}>
          <Blockquote icon={<IconQuote />} radius="sm" color="cyan" cite="– Lukas W." w="100%" styles={{ root: { backgroundColor: 'var(--mantine-primary-color-0)' } }}>
            Der Mietvertrag-Generator hat mir viel Zeit und Stress erspart! Einfach zu bedienen und rechtlich auf dem neuesten Stand.
          </Blockquote>

          <Blockquote icon={<IconQuote />} radius="sm" color="cyan" cite="– Sarah K." w="100%" styles={{ root: { backgroundColor: 'var(--mantine-primary-color-0)' } }}>
            So unkompliziert war das Erstellen von Mietverträgen noch nie. Der Preis ist unschlagbar.
          </Blockquote>
        </Flex>
      </Box>

      <Box py="6em" pos="relative">
        <Box pos="absolute" w="100vw" h="100%" bg="white" left="50%" top="0" style={{ transform: 'translateX(-50%)', zIndex: -1 }}></Box>
        <Title order={2} ta="center" mb="xl">Preise</Title>

        <Pricing
          cta1={<Button variant="outline" fullWidth component={Link} href="/mietvertrag-generator">Jetzt Mietvertrag erstellen</Button>}
          cta2={<Button variant="outline" fullWidth component={Link} href="/registrieren">Jetzt Registrieren</Button>}
        />
      </Box>
      <Box py="6em" pos="relative">
        <Box className={styles.skewed} bg="var(--mantine-color-gray-0)" top="0" />
        <Title order={2} ta="center" mb="xl">Häufig gestellte Fragen</Title>

        <Box bg="white" maw="600px" m="0 auto" >
          <Accordion bg="white" radius="md" withBorder>
            <FaqItem
              question="Wie funktioniert der Mietvertrag-Generator?"
              answer="Ganz einfach: Fülle unser Formular aus, und dein individueller Mietvertrag wird sofort generiert und ist als PDF Download verfügbar."
            />
            <FaqItem
              question="Ist der Mietvertrag rechtssicher?"
              answer="Ja, unsere Verträge basieren auf den aktuellsten gesetzlichen Vorgaben."
            />
            <FaqItem
              question="Muss ich mich registrieren, um einen Mietvertrag zu erstellen?"
              answer="Für eine einmalige Generierung ist keine Registrierung erforderlich. Wenn du jedoch deine Verträge speichern und verwalten möchtest, empfehlen wir die Erstellung eines Accounts."
            />
            <FaqItem
              question="Ist der Vertrag auch in anderen Sprachen verfügbar?"
              answer="Der Mietvertrag-Generator unterstützt aktuell nur deutschsprachige Verträge. Weitere Sprachen könnten jedoch in zukünftigen Updates hinzugefügt werden."
            />
          </Accordion>
        </Box>
      </Box>
      <Box py="6em" pos="relative">
        <Box className={styles.lightPattern}></Box>
        <Box align="center">
          <Title order={2} mb="md">Warum warten? Starte jetzt!</Title>
          <Text mb="xl" fs="italic">Erstelle deinen Mietvertrag in nur wenigen Minuten und spare Zeit und Geld.</Text>
          <Button size="xl" variant="white" component={Link} href="/mietvertrag-generator">Jetzt Mietvertrag erstellen</Button>
        </Box>
      </Box>
    </Layout >
  )
}

export default Home
