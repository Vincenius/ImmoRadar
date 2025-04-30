import React from 'react'
import { Flex, Card, Box, Title, Text, List, ThemeIcon, Button } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import Link from 'next/link';

function Pricing({ CtaPremium, CtaProfessional, CtaFree, showFree, plan }) {
  const dir = showFree ? { base: "column", md: "row" } : { base: "column", sm: "row" }

  return (
    <Flex mb="xl" gap="xl" direction={dir}>
      {showFree && <Card bg="white" p="md" radius="md" withBorder w="100%" shadow="md">
        <Flex direction="column" justify="space-between" h="100%">
          <Box>
            <Title order={2} size="h4" mb="sm" ta="center" fw="300">Kostenlos</Title>
            <Text size="3em" lh="h1" fw="bold" ta="center" mb="lg">0€</Text>

            <List
              spacing="sm"
              center
              icon={
                <ThemeIcon color="cyan.9" variant="outline" size={24} radius="xl">
                  <IconCheck size={16} />
                </ThemeIcon>
              }
            >
              <List.Item>Alle Zuschüsse, die du selbst beantragen kannst</List.Item>
              <List.Item>Alle Zuschüsse, die du mit Hilfe eines Energieberaters beantragen kannst</List.Item>
              <List.Item>Alle Kredite, die über Finanzierungspartner beantragt werden können</List.Item>
            </List>
          </Box>

          {!CtaFree && <Button mt="lg" size="md" component={Link} href="/foerdercheck">Jetzt kostenlos starten!</Button>}
          {CtaFree}
        </Flex>
      </Card>}
      <Card bg="white" p="md" radius="md" withBorder w="100%" bd="1px solid cyan.9" shadow="md">
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
              <List.Item>Alles aus der kostenfreien Version</List.Item>
              <List.Item>Detaillierte Informationen zu deinen Förderungen</List.Item>
              <List.Item>Schritt-für-Schritt-Anleitungen zur Beantragung</List.Item>
              <List.Item>Kurze Fragebögen, für alle Zuschüsse, die du selbst beantragen kannst, die dir sofort zeigen, ob du für die Förderung berechtigt bist.</List.Item>
            </List>
          </Box>

          {CtaPremium}
        </Flex>
      </Card>
      <Card bg="white" p="md" radius="md" withBorder w="100%" shadow="md">
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
              <List.Item>Alles aus der Premium Version</List.Item>
              <List.Item>Kurze Fragebögen, für alle Zuschüsse, die du mit Hilfe eines Energieberaters beantragen kannst, die dir sofort zeigen, ob du für die Förderung berechtigt bist.</List.Item>
            </List>
          </Box>

          {CtaProfessional}
        </Flex>
      </Card>
    </Flex>
  )
}

export default Pricing
