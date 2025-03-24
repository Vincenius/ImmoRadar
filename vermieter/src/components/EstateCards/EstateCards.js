import React from 'react'
import { Card, Flex, ThemeIcon, Text, Button, Skeleton, Grid, Box } from '@mantine/core'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher';
import { IconHome, IconFilePlus } from '@tabler/icons-react';
import Link from 'next/link';

const EstateCard = ({ estate, isLoading }) => {
  return (
    <Card shadow="md" padding="lg" radius="md" withBorder h="100%">
      <Flex direction="column" justify="space-between" h="100%">
        <Box mb="md">
          <Flex gap="md" mb="md" align="center">
            <ThemeIcon variant="light">
              <IconHome style={{ width: '70%', height: '70%' }} />
            </ThemeIcon>
            {isLoading && <Skeleton height={8} radius="xl" width="250px" />}
            {!isLoading && <Text>
              <b>{estate.street}, {estate.zip} {estate.city}</b>{(estate.level || estate.location) && ' - '}
              {estate.level ? `${estate.level} Etage` : ''} {estate.location}
            </Text>}
          </Flex>
        </Box>

        {isLoading && <Button variant="outline" mb="md">
          <Skeleton height={8} radius="xl" w="50%" />
        </Button>}
        {!isLoading && <Button href={`/app/mietvertrag-generator?estate=${estate._id}`} component={Link} variant="outline" mb="md">
          Mietvertrag erstellen
        </Button>}

        {isLoading && <Flex gap="md">
          <Button variant="default" size="xs" fullWidth><Skeleton height={8} radius="xl" w="50%" /></Button>
          <Button variant="default" c="red" fullWidth size="xs"><Skeleton height={8} radius="xl" w="50%" /></Button>
        </Flex>}

        {!isLoading && <Flex gap="md">
          <Button href={`/app/immobilie?edit=${estate._id}`} component={Link} target="_blank" variant="default" size="xs" fullWidth>
            Bearbeiten TODO
          </Button>
          <Button onClick={() => console.log('TODO')} variant="default" c="red" fullWidth size="xs">Löschen TODO</Button>
        </Flex>}
      </Flex>
    </Card>
  )
}

function EstateCards({ maxCards }) {
  const { data = [], isLoading } = useSWR('/api/user-estates', fetcher)
  const estates = maxCards ? data.slice(0, maxCards) : data

  if (isLoading) {
    return (
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}><EstateCard isLoading /></Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}><EstateCard isLoading /></Grid.Col>
      </Grid>
    )
  }
  return (
    <>
      <Grid gap="md">
        {estates.map(estate => (
          <Grid.Col key={estate._id} span={{ base: 12, sm: 6, lg: 4 }}><EstateCard estate={estate} /></Grid.Col>
        ))}
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <Card shadow="md" padding="lg" radius="md" withBorder h="100%" component={Link} href="/app/immobilie">
            <Flex h="100%" direction="column" align="center" justify="center">
              <IconFilePlus style={{ width: '30px', height: '30px' }} />
              <Text mt="md" fs="italic" ta="center">Neue Immobilie erstellen</Text>
            </Flex>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  )
}

export default EstateCards
