import React from 'react'
import Layout from '@/components/Layout/Layout';
import { Card, Container, Text, Title } from '@mantine/core';

export async function getServerSideProps({ resolvedUrl }) {
  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const variant = params.get('variant');

  return {
    props: { variant },
  };
}


function ThankYouPage({ variant }) {
  const variantMap = {
    starter: 'Starter',
    premium: 'Premium',
    premium_plus: 'Premium Plus',
  };

  return (
    <Layout title="Danke für den Kauf" noindex={true} withBackground={true}>
      <Container size="sm">
        <Card shadow="md" padding="lg" radius="md">
          <Title order={2} mb="sm">Vielen Dank für deinen Kauf{(variant && variantMap[variant]) ? ` der ${variantMap[variant]} Variante` : ''}!</Title>
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
