import React from 'react'
import Layout from '@/components/Layout/Layout'
import { Card, Title, Text, Button } from '@mantine/core'
import { useRouter } from 'next/router';

function Download() {
  const router = useRouter();
  const { query } = router;

  return (
    <Layout title={`Mietvertrag Download | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}>
      <Card withBorder shadow="md" maw="500px" m="0 auto">
        <Title order={2} size="h3" mb="xl" mt="md" ta="center">Dein Mietvertrag ist bereit!</Title>
        <Text mb="xl">Klicke auf den Button, um deinen fertigen Mietvertrag als PDF herunterzuladen:</Text>

        <Button mb="sm" href={`/api/download?id=${query.token}`} component="a" target="_blank">
          Mietvertrag herunterladen
        </Button>
        <Text mb="xl" size="xs" fw="italic">Es kann dann ein paar Sekunden dauern, bis die Datei bereit ist. Bitte habe etwas Geduld.</Text>

        <Text>Wenn du Fragen hast oder Unterstützung benötigst, steht unser Team jederzeit für dich bereit. Viel Erfolg bei deinem Mietvertrag!</Text>
      </Card>

    </Layout>
  )
}

export default Download
