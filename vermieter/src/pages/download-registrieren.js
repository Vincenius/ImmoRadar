import React from 'react'
import Layout from '@/components/Layout/Layout'
import { Card, Title, Text, Button, Flex } from '@mantine/core'
import { useRouter } from 'next/router';
import Link from 'next/link'

function Download() {
  const router = useRouter();
  const { query } = router;

  // TODO falls eingeloggt und kein pro abo -> direkt verknüpfen

  return (
    <Layout title={`Mietvertrag Download | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}>
      <Card withBorder shadow="md" maw="500px" m="0 auto">
        <Title order={2} size="h3" mb="xl" mt="md" ta="center">Dein Mietvertrag ist bereit!</Title>
        <Text mb="xl">Klicke auf den Button, um deinen fertigen Mietvertrag als PDF herunterzuladen:</Text>

        <Button mb="sm" href={`/api/download?id=${query.token}`} component="a" target="_blank">
          Mietvertrag herunterladen
        </Button>
        <Text mb="xl" size="xs" fw="italic">Es kann dann ein paar Sekunden dauern, bis die Datei bereit ist. Bitte habe etwas Geduld.</Text>

        {/* TODO falls nicht eingeloggt? */}
        <Text mb="xl">
          Um dein Jahresabo zu nutzen, erstelle bitte einen Account oder logge dich ein. So kannst du jederzeit auf alle Vertragsvorlagen zugreifen und von regelmäßigen Updates profitieren.
        </Text>
        <Flex gap="md" justify="center" mb="xl">
          <Button component={Link} href={`/registrieren?stripe_id=${query.stripe_id}`}>Jetzt Registrieren</Button>
          <Button variant="outline" component={Link} href={`/login?stripe_id=${query.stripe_id}`}>Einloggen</Button>
        </Flex>

        <Text>Wenn du Fragen hast oder Unterstützung benötigst, steht unser Team jederzeit für dich bereit. Viel Erfolg bei deinem Mietvertrag!</Text>
      </Card>

    </Layout>
  )
}

export default Download
