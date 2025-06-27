import React from 'react'
import Layout from '@/components/Layout/Layout';
import { Card, Container, Text, Title } from '@mantine/core';

function ThankYouPage() {
  return (
    <Layout title="Danke für den Kauf" noindex={true} withBackground={true}>
      <Container size="sm">
        <Card shadow="md" padding="lg" radius="md">
          <Title order={2} mb="sm">Vielen Dank für deinen Kauf!</Title>
          <Text mb="xs">
            Wir haben deine Bestellung erhalten.
          </Text>
          <Text mb="xs">
            Um deinen Förderreport zu erhalten, <b>bestätige bitte deine E-Mail-Adresse</b>.
          </Text>
          <Text>
            Schau dafür in dein Postfach und klicke auf den Bestätigungslink, den wir dir soeben geschickt haben.
          </Text>
        </Card>
      </Container>
    </Layout>
  )
}

export default ThankYouPage
