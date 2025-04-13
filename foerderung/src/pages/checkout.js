import React, { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { Title, Card, Flex, List, ThemeIcon, Box, Button, Text } from '@mantine/core';
import Checkout from '@/components/Checkout/Checkout';
import { IconCheck, IconCircleCheck } from '@tabler/icons-react';

export async function getServerSideProps({ resolvedUrl }) {
  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');
  const baseUrl = process.env.BASE_URL

  if (!id) {
    return {
      redirect: {
        destination: '/foerdercheck',
        permanent: false,
      },
    };
  }

  const data = await fetch(`${baseUrl}/api/subsidies?id=${id}`, {
    method: 'GET',
    headers: {
      'x-api-key': process.env.API_KEY
    }
  }).then(res => res.json())

  if (data?.user?.Variant === 'professional') {
    return {
      redirect: {
        destination: '/report?id=' + id,
        permanent: false,
      },
    };
  }

  return {
    props: { id, email: data?.user?.Email, plan: data?.user?.Variant },
  };
}

function ReportCheckout({ id, email, plan }) {
  const [variant, setVariant] = useState()

  return (
    <Layout
      title="Checkout | Fertighaus Radar"
      description="todo."
      noindex={true}
    >
      <Title order={1} mt="xl" mb="lg">Checkout</Title>
      {!variant && <Flex mb="xl" gap="xl" direction={{ base: "column", sm: "row" }}>
        <Card bg="white" p="md" radius="md" withBorder w="100%" shadow="md">
          <Flex direction="column" justify="space-between" h="100%">
            <Box>
              <Title order={2} size="h4" mb="sm" ta="center" fw="300">Premium</Title>
              <Text size="3em" lh="h1" fw="bold" ta="center" mb="lg">49€</Text>

              <List
                spacing="sm"
                center
                icon={
                  <ThemeIcon color="cyan.9" variant="outline" size={24} radius="xl">
                    <IconCheck size={16} />
                  </ThemeIcon>
                }
              >
                <List.Item>Alle Fördermittel, die du selbst beantragen kannst</List.Item>
                <List.Item>Alle Kredite, die über Finanzierungspartner möglich sind</List.Item>
              </List>
            </Box>

            <Button mt="lg" variant="outline" onClick={() => setVariant('premium')} disabled={plan === 'premium'}>
              {plan === 'premium' ? <><IconCircleCheck size={16} />&nbsp;Du hast bereits Premium</> : 'Jetzt Kaufen'}
            </Button>
          </Flex>
        </Card>
        <Card bg="white" p="md" radius="md" withBorder w="100%" bd="1px solid cyan.9" shadow="md">
          <Flex direction="column" justify="space-between" h="100%">
            <Box>
              <Title order={2} size="h4" mb="sm" ta="center" fw="300">Professional</Title>
              {plan !== 'premium' && <Text size="3em" lh="h1" fw="bold" ta="center" mb="lg">89€</Text>}
              {plan === 'premium' && <Flex justify="center" gap="md" align="center">
                <Text size="2em" lh="h1" ta="center" mb="md" c="red.9" td="line-through">89€</Text>
                <Text size="3em" lh="h1" fw="bold" ta="center" mb="lg">40€</Text>
              </Flex>}

              <List
                spacing="sm"
                center
                icon={
                  <ThemeIcon color="cyan.9" variant="outline" size={24} radius="xl">
                    <IconCheck size={16} />
                  </ThemeIcon>
                }
              >
                <List.Item>Alle Fördermittel, die du selbst beantragen kannst</List.Item>
                <List.Item>Alle Kredite, die über Finanzierungspartner möglich sind</List.Item>
                <List.Item>Alle Zuschüsse, die mit einem Energieberater beantragt werden können</List.Item>
              </List>
            </Box>

            <Button mt="lg" onClick={() => setVariant('professional')} disabled={plan === 'professional'}>
              {plan === 'premium' ? 'Jetzt Upgraden' : 'Jetzt Kaufen'}
            </Button>
          </Flex>
        </Card>
      </Flex>}
      {variant && <Card bg="white" px="md" py="xl" radius="md" withBorder mb="xl" shadow="md">
        <Checkout email={email} id={id} variant={variant} />
        <Button mt="lg" variant="outline" onClick={() => setVariant(null)} w="150px">Zurück</Button>
      </Card>}
    </Layout>
  )
}

export default ReportCheckout
