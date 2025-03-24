import React, { useState } from 'react'
import { Card, Flex, ThemeIcon, Text, Button, Skeleton, Grid, Box, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher';
import { IconHome, IconUser, IconCalendar, IconFilePlus, IconEdit } from '@tabler/icons-react';
import Link from 'next/link';

const ContractCard = ({ contract, isLoading, setDeleteData }) => {
  return (
    <Card shadow="md" padding="lg" radius="md" withBorder h="100%">
      <Flex direction="column" justify="space-between" h="100%">
        <Box mb="md">
          <Flex gap="md" mb="md" align="center">
            <ThemeIcon variant="light">
              <IconHome style={{ width: '70%', height: '70%' }} />
            </ThemeIcon>
            {isLoading && <Skeleton height={8} radius="xl" width="250px" />}
            {!isLoading && <Text fw="bold">{contract.street}, {contract.zip} {contract.city}</Text>}
          </Flex>
          <Flex gap="md" mb="md" align="center">
            <ThemeIcon variant="light">
              <IconCalendar style={{ width: '70%', height: '70%' }} />
            </ThemeIcon>
            {isLoading && <Skeleton height={8} radius="xl" w="50%" />}
            {!isLoading && <Text>{new Date(contract.rentStart).toLocaleDateString('de-DE', { dateStyle: 'long' })}</Text>}
          </Flex>
          <Flex gap="md" mb="md" align="center">
            <ThemeIcon variant="light">
              <IconUser style={{ width: '70%', height: '70%' }} />
            </ThemeIcon>
            {isLoading && <Skeleton height={8} radius="xl" w="70%" />}
            {!isLoading && <Text>{contract.tenantName}</Text>}
          </Flex>
        </Box>
        {isLoading && <Button variant="outline" mb="md">
          <Skeleton height={8} radius="xl" w="50%" />
        </Button>}
        {!isLoading && <Button href={`/api/download?id=${contract._id}`} component="a" target="_blank" variant="outline" mb="md">
          Mietvertrag herunterladen
        </Button>}

        {isLoading && <Flex gap="md">
          <Button variant="default" size="xs" fullWidth><Skeleton height={8} radius="xl" w="50%" /></Button>
          <Button variant="default" c="red" fullWidth size="xs"><Skeleton height={8} radius="xl" w="50%" /></Button>
        </Flex>}

        {!isLoading && <Flex gap="md">
          <Button href={`/app/mietvertrag-generator?edit=${contract._id}`} component={Link} target="_blank" variant="default" size="xs" fullWidth>
            Bearbeiten
          </Button>
          <Button onClick={() => setDeleteData(contract)} variant="default" c="red" fullWidth size="xs">Löschen</Button>
        </Flex>}
      </Flex>
    </Card>
  )
}

function ContractCards({ maxContracts }) {
  const [deleteData, setDeleteData] = useState()
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { data = [], isLoading, mutate } = useSWR('/api/user-contracts', fetcher)
  const contracts = maxContracts ? data.slice(0, maxContracts) : data

  const deleteContract = () => {
    setDeleteLoading(true)
    fetch(`/api/delete-contract?id=${deleteData._id}`, { method: 'DELETE' }).then(() => {
      setDeleteLoading(false)
      setDeleteData(null)
      mutate()
    })
  }

  if (isLoading) {
    return (
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}><ContractCard isLoading /></Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}><ContractCard isLoading /></Grid.Col>
      </Grid>
    )
  }
  return (
    <>
      <Modal opened={deleteData && deleteData._id} onClose={() => setDeleteData(null)} title="Vertrag Löschen">
        {deleteData && <>
          <Text mb="md">Bist du dir sicher, dass du folgenden Vertrag löschen willst?</Text>
          <Text mb="md" fw="bold">{deleteData.street}, {deleteData.zip} {deleteData.city}</Text>
          <Flex gap="md">
            <Button variant='outline' w="50%" onClick={() => setDeleteData(null)} disabled={deleteLoading}>Abbrechen</Button>
            <Button color="red.9" w="50%" onClick={deleteContract} loading={deleteLoading}>Vertrag Löschen</Button>
          </Flex>
        </>}
      </Modal>
      <Grid gap="md">
        {contracts.map(contract => (
          <Grid.Col key={contract._id} span={{ base: 12, sm: 6, lg: 4 }}><ContractCard contract={contract} setDeleteData={setDeleteData} /></Grid.Col>
        ))}
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <Card shadow="md" padding="lg" radius="md" withBorder h="100%" component={Link} href="/app/mietvertrag-generator">
            <Flex h="100%" direction="column" align="center" justify="center">
              <IconFilePlus style={{ width: '30px', height: '30px' }} />
              <Text mt="md" fs="italic" ta="center">Neuen Vertrag erstellen</Text>
            </Flex>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ContractCards
