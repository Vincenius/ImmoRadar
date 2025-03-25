import React, { useState } from 'react'
import { Card, Flex, ThemeIcon, Text, Button, Skeleton, Grid, Box, Modal } from '@mantine/core'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher';
import { IconHome, IconFilePlus } from '@tabler/icons-react';
import Link from 'next/link';

const EstateCard = ({ estate, isLoading, setDeleteData }) => {
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
          <Button href={`/app/immobilien/bearbeiten?id=${estate._id}`} component={Link} variant="default" size="xs" fullWidth>
            Bearbeiten
          </Button>
          <Button onClick={() => setDeleteData(estate)} variant="default" c="red" fullWidth size="xs">Löschen</Button>
        </Flex>}
      </Flex>
    </Card>
  )
}

function EstateCards({ maxCards }) {
  const [deleteLoading, setDeleteLoading] = useState()
  const [deleteData, setDeleteData] = useState()
  const { data = [], isLoading, mutate } = useSWR('/api/user-estates', fetcher)
  const estates = maxCards ? data.slice(0, maxCards) : data
  const deleteEstate = () => {
    setDeleteLoading(true)
    fetch(`/api/estates?id=${deleteData._id}`, { method: 'DELETE' }).then(() => {
      setDeleteLoading(false)
      setDeleteData(null)
      mutate()
    })
  }

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
      <Modal opened={deleteData && deleteData._id} onClose={() => setDeleteData(null)} title="Immobilie Löschen">
        {deleteData && <>
          <Text mb="md">Bist du dir sicher, dass du folgende Immobilie löschen willst?</Text>
          <Text mb="md" fw="bold">{deleteData.street}, {deleteData.zip} {deleteData.city}</Text>
          <Flex gap="md">
            <Button variant='outline' w="50%" onClick={() => setDeleteData(null)} disabled={deleteLoading}>Abbrechen</Button>
            <Button color="red.9" w="50%" onClick={deleteEstate} loading={deleteLoading}>Immobilie Löschen</Button>
          </Flex>
        </>}
      </Modal>
      <Grid gap="md">
        {estates.map(estate => (
          <Grid.Col key={estate._id} span={{ base: 12, sm: 6, lg: 4 }}>
            <EstateCard estate={estate} setDeleteData={setDeleteData} />
          </Grid.Col>
        ))}
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <Card shadow="md" padding="lg" radius="md" withBorder h="100%" component={Link} href="/app/immobilien/neu">
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
