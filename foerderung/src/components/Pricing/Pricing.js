import React from 'react'
import { Flex, Card, Box, Title, Text, List, ThemeIcon, Button, Grid } from '@mantine/core';
import { IconCheck, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

function Pricing({ CtaStarter, CtaPremium, CtaFree, showFree, CtaPremiumPlus, plan }) {
  const colSpan = showFree
    ? { base: 12, sm: 6 }
    : { base: 12, sm: 4 }

  return (
    <Grid mb="xl" gutter="xl">
      {showFree && <Grid.Col span={colSpan}>
        <Card bg="white" p="md" radius="md" withBorder w="100%" h="100%" shadow="md">
          <Flex direction="column" justify="space-between" h="100%">
            <Box>
              <Title order={2} size="h4" mb="sm" ta="center" fw="300">Kostenfrei</Title>
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
                <List.Item>Alle Zuschüsse, die Du selbst beantragen kannst</List.Item>
                <List.Item>Alle Zuschüsse, die Du mit Hilfe eines Energieberaters beantragen kannst</List.Item>
                <List.Item>Alle Kredite, die über Finanzierungspartner beantragt werden können</List.Item>
              </List>
            </Box>

            <Box mt="xl">
              {!CtaFree && <Button size="md" component={Link} href="/foerdercheck" fullWidth>Jetzt kostenlos starten!</Button>}
              {CtaFree}

              <Text fs="italic" lh="1.2em" mt="md">Ideal für alle, die sich einen ersten schnellen Überblick verschaffen wollen.</Text>
            </Box>
          </Flex>
        </Card>
      </Grid.Col>}

      <Grid.Col span={colSpan}>
        <Card bg="white" p="md" radius="md" withBorder w="100%" h="100%" bd="2px solid cyan.9" shadow="md">
          <Flex direction="column" justify="space-between" h="100%">
            <Box>
              <Title order={2} size="h4" mb="sm" ta="center" fw="300">Starter</Title>
              <Text size="3em" lh="h1" fw="bold" ta="center" mb="lg">
                <span style={{ fontSize: '0.4em', fontWeight: 'normal' }}>nur &nbsp;</span>
                39€
              </Text>

              <List
                spacing="sm"
                center
                icon={
                  <ThemeIcon color="cyan.9" variant="outline" size={24} radius="xl">
                    <IconPlus size={16} />
                  </ThemeIcon>
                }
              >
                <List.Item icon={
                  <ThemeIcon color="cyan.9" variant="filled" size={24} radius="xl">
                    <IconCheck size={16} />
                  </ThemeIcon>
                }>Alle Infos aus der kostenfreien Variante</List.Item>
                <List.Item>Quickcheck, für welche Förderungen Du berechtigt bist</List.Item>
                <List.Item>Detaillierte Informationen zu Deiner persönlichen Förderhöhe</List.Item>
                <List.Item>Beantragung durch dich selbst und mit Hilfe von Experten</List.Item>
              </List>
            </Box>

            <Box mt="xl">
              {CtaStarter}

              <Text fs="italic" lh="1.2em" mt="md">Ideal für alle, die schnelle Ergebnisse wollen.</Text>
              <Text fs="italic" lh="1.2em">&nbsp;</Text>
            </Box>
          </Flex>
        </Card>
      </Grid.Col>

      <Grid.Col span={colSpan}>
        <Card bg="white" p="md" radius="md" withBorder w="100%" h="100%" shadow="md">
          <Flex direction="column" justify="space-between" h="100%">
            <Box>
              <Title order={2} size="h4" mb="sm" ta="center" fw="300">Premium</Title>
              {plan !== 'starter' && <Text size="3em" lh="h1" fw="bold" ta="center" mb="lg">
                <span style={{ fontSize: '0.4em', fontWeight: 'normal' }}>nur &nbsp;</span>
                59€
              </Text>}
              {plan === 'starter' && <Flex justify="center" gap="md" align="center">
                <Text size="2em" lh="h1" ta="center" mb="md" c="red.9" td="line-through">59€</Text>
                <Text size="3em" lh="h1" fw="bold" ta="center" mb="lg">20€</Text>
              </Flex>}

              <List
                spacing="sm"
                center
                icon={
                  <ThemeIcon color="cyan.9" variant="outline" size={24} radius="xl">
                    <IconPlus size={16} />
                  </ThemeIcon>
                }
              >
                <List.Item icon={
                  <ThemeIcon color="cyan.9" variant="filled" size={24} radius="xl">
                    <IconCheck size={16} />
                  </ThemeIcon>
                }>Alles aus der Starter Variante</List.Item>
                <List.Item>Schritt-für-Schritt-Anleitungen zur schnellen Beantragung Deiner Förderungen</List.Item>
                <List.Item>Schneller Zugriff auf zertifizierte Energieberater in Deiner Region</List.Item>
                <List.Item>Schneller Zugriff auf qualifizierte Finanzierungsberater </List.Item>
              </List>
            </Box>

            <Box mt="xl">
              {CtaPremium}

              <Text fs="italic" lh="1.2em" mt="md">Ideal für alle, die schnelle Ergebnisse wollen, allerdings keine Zeit haben.</Text>
            </Box>
          </Flex>
        </Card>
      </Grid.Col>

      <Grid.Col span={colSpan}>
        <Card bg="white" p="md" radius="md" withBorder w="100%" h="100%" shadow="md">
          <Flex direction="column" justify="space-between" h="100%">
            <Box>
              <Title order={2} size="h4" mb="sm" ta="center" fw="300">Premium Plus</Title>
              {plan !== 'starter' && plan !== 'premium' && <Text size="3em" lh="h1" fw="bold" ta="center" mb="lg">
                <span style={{ fontSize: '0.4em', fontWeight: 'normal' }}>nur &nbsp;</span>
                199€
              </Text>}
              {plan === 'starter' && <Flex justify="center" gap="md" align="center">
                <Text size="2em" lh="h1" ta="center" mb="md" c="red.9" td="line-through">199€</Text>
                <Text size="3em" lh="h1" fw="bold" ta="center" mb="lg">160€</Text>
              </Flex>}

              {plan === 'premium' && <Flex justify="center" gap="md" align="center">
                <Text size="2em" lh="h1" ta="center" mb="md" c="red.9" td="line-through">199€</Text>
                <Text size="3em" lh="h1" fw="bold" ta="center" mb="lg">140€</Text>
              </Flex>}

              <List
                spacing="sm"
                center
                icon={
                  <ThemeIcon color="cyan.9" variant="outline" size={24} radius="xl">
                    <IconPlus size={16} />
                  </ThemeIcon>
                }
              >
                <List.Item icon={
                  <ThemeIcon color="cyan.9" variant="filled" size={24} radius="xl">
                    <IconCheck size={16} />
                  </ThemeIcon>
                }>Alles aus der Premium Variante</List.Item>
                <List.Item>Maßgeschneiderter Förderstrategie</List.Item>
                <List.Item>Individueller Finanzübersicht: Was ist realistisch möglich?</List.Item>
                <List.Item>Übernahme der Antragstellung & Begleitung bis zur Auszahlung</List.Item>
                <List.Item>Vernetzung mit geprüften Energieberater:innen</List.Item>
                <List.Item>Exklusive Konzepterstellung für Dein Projekt</List.Item>
              </List>
            </Box>

            <Box mt="xl">
              {CtaPremiumPlus}

              <Text fs="italic" lh="1.2em" mt="md">„Wieviel Haus kann ich mir leisten?“ – Deine exklusive 1:1-Beratung.</Text>
            </Box>
          </Flex>
        </Card>
      </Grid.Col>
    </Grid>
  )
}

export default Pricing
