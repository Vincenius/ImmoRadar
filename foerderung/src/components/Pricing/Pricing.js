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
              <Title order={2} size="h4" mb="sm" ta="center" fw="300">Basis</Title>
              <Text size="3em" lh="h1" fw="bold" ta="center" mb="lg">0,-€</Text>

              <List
                spacing="sm"
                center
                icon={
                  <ThemeIcon color="cyan.9" variant="outline" size={24} radius="xl">
                    <IconCheck size={16} />
                  </ThemeIcon>
                }
              >
                <List.Item>Übersicht passender Förderprogramme</List.Item>
                <List.Item>Regionale & bundesweite Fördermittel</List.Item>
              </List>
            </Box>

            <Box mt="xl">
              {!CtaFree && <Button size="md" component={Link} href="/foerdercheck" fullWidth>Jetzt kostenlos starten!</Button>}
              {CtaFree}

              <Text fs="italic" lh="1.2em" mt="md">Beste Wahl für den ersten Überblick</Text>
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
                69,-€
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
                <List.Item>Persönlicher Fördercheck</List.Item>
                <List.Item>Priorisierung nach Förderhöhe & Machbarkeit</List.Item>
              </List>
            </Box>

            <Box mt="xl">
              {CtaStarter}

              <Text fs="italic" lh="1.2em" mt="md">Beste Wahl für Einsteiger.</Text>
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
                99,-€
              </Text>}
              {plan === 'starter' && <Flex justify="center" gap="md" align="center">
                <Text size="2em" lh="h1" ta="center" mb="md" c="red.9" td="line-through">99,-€</Text>
                <Text size="3em" lh="h1" fw="bold" ta="center" mb="lg">30,-€</Text>
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
                <List.Item>Empfehlungen zur Antragstellung</List.Item>
                <List.Item>Kombinierbarkeit von Programmen</List.Item>
              </List>
            </Box>

            <Box mt="xl">
              {CtaPremium}

              <Text fs="italic" lh="1.2em" mt="md">Beste Wahl für anspruchsvolle Projekte wo jede Förderung genutzt werden soll!</Text>
            </Box>
          </Flex>
        </Card>
      </Grid.Col>

      <Grid.Col span={colSpan}>
        <Card bg="white" p="md" radius="md" withBorder w="100%" h="100%" shadow="md">
          <Flex direction="column" justify="space-between" h="100%">
            <Box>
              <Title order={2} size="h4" mb="sm" ta="center" fw="300">Premium Plus</Title>
              {plan !== 'starter' && plan !== 'premium' && <Text size="3em" lh="h1" fw="bold" ta="center" mb="md">
                <span style={{ fontSize: '0.4em', fontWeight: 'normal' }}>nur &nbsp;</span>
                299,-€
              </Text>}
              {plan === 'starter' && <Flex justify="center" gap="md" align="center">
                <Text size="2em" lh="h1" ta="center" mb="md" c="red.9" td="line-through">299,-€</Text>
                <Text size="3em" lh="h1" fw="bold" ta="center" mb="md">160,-€</Text>
              </Flex>}

              {plan === 'premium' && <Flex justify="center" gap="md" align="center">
                <Text size="2em" lh="h1" ta="center" mb="md" c="red.9" td="line-through">299,-€</Text>
                <Text size="3em" lh="h1" fw="bold" ta="center" mb="md">140,-€</Text>
              </Flex>}

              <Text ta="center" c="gray.7" mb="lg">kostenloses Erstgespräch, Entscheide später ob Dir die Zusammenarbeit das Geld wert ist.</Text>

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
                }>Alles aus der Premium Variante.</List.Item>
                <List.Item>Individueller Förderfahrplan (inkl. Zeitplan)</List.Item>
                <List.Item>Persönliche Beratung durch Experten</List.Item>
              </List>
            </Box>

            <Box mt="xl">
              {CtaPremiumPlus}

              <Text fs="italic" lh="1.2em" mt="md">Beste Wahl für jeden der auf Nummer sicher gehen will. Rundum-Service mit schnellen Ergebnissen!</Text>
            </Box>
          </Flex>
        </Card>
      </Grid.Col>
    </Grid>
  )
}

export default Pricing
