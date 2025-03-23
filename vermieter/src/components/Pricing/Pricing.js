import React from 'react'
import { Flex, Card, Text, Title, List, Box } from '@mantine/core';
import styles from './Pricing.module.css'

function Pricing({ cta1, cta2, onlySubscription = false }) {
  return (
    <Flex gap="xl" direction={{ base: 'column', xs: 'row' }}>
      {!onlySubscription && <Card shadow="lg" withBorder w="100%">
        <Card.Section p="xl" className={styles.pattern}>
          <Text ta="center" fw="300" c="white">Einmalige Generierung</Text>
          <Title ta="center" c="white">0,99€</Title>
        </Card.Section>
        <Card.Section p="xl" h="100%">
          <Flex direction="column" justify="space-between" h="100%">
            <List mb="lg">
              <List.Item>individuell angepassten, rechtssicheren Mietvertrag als PDF zum Herunterladen</List.Item>
            </List>
            <Box>
              <Text fs="italic" mb="xl">Ideal für Vermieter, die nur gelegentlich einen Mietvertrag benötigen.</Text>
              {cta1}
            </Box>
          </Flex>
        </Card.Section>
      </Card> }

      <Card shadow="lg" withBorder w="100%">
        <Card.Section p="xl" className={styles.pattern}>
          <Text ta="center" fw="300" c="white">Jahresabo</Text>
          <Title ta="center" c="white">24,99€ / Jahr</Title>
        </Card.Section>
        <Card.Section p="xl">
          <List mb="lg">
            <List.Item>Unbegrenzte Generierung von Mietverträgen</List.Item>
            <List.Item>Alle deine Verträge werden sicher in deinem Account gespeichert und sind jederzeit abrufbar</List.Item>
            <List.Item>Du kannst bestehende Verträge jederzeit anpassen und neu generieren</List.Item>
          </List>
          <Box>
            <Text fs="italic" mb="xl">Ideal für Vermieter mit mehreren Mietverhältnissen oder Immobilienbesitzer, die regelmäßig Verträge erstellen müssen.</Text>
            {cta2}
          </Box>
          <Text fs="italic"></Text>
        </Card.Section>
      </Card>
    </Flex>
  )
}

export default Pricing
