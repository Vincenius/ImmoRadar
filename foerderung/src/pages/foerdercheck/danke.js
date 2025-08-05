import React from 'react'
import Layout from '@/components/Layout/Layout';
import { Card, Container, Text, Title } from '@mantine/core';

function ThankYouPage() {
  return (
    <Layout title="Danke für den Kauf" noindex={true} withBackground={true}>
      <Container size="sm">
        <Card shadow="md" padding="lg" radius="md">
          <Title order={2} mb="sm">Fast geschafft!</Title>
          <Text mb="xs">
            Wir haben Dir eine E-Mail geschickt, um Deine Adresse zu bestätigen.
          </Text>
          <Text>
            Nach der Bestätigung steht Dein kostenloser PDF-Report zum Download bereit.
          </Text>
        </Card>
      </Container>
    </Layout>
  )
}

export default ThankYouPage
