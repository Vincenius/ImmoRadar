import { useState, useEffect } from 'react';
import useSWR from 'swr'
import { useRouter } from 'next/router';
import { Box, Card, Flex, Select, NumberInput, rem, Text, Button, Divider, Collapse, Checkbox, TextInput, Modal, Pagination } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCurrencyEuro, IconAdjustmentsHorizontal, IconBell } from '@tabler/icons-react'
import Layout from '@/components/Layout/Layout'
import SearchBar from '@/components/SearchBar/SearchBar';
import SearchItem from '@/components/SearchItem/SearchItem';
import SearchItemLoader from '@/components/SearchItem/SearchItemLoader';
import { fetcher } from '@/utils/fetcher'
import { featureMap } from '@/utils/featureMap'
import { providers } from '@/utils/providers'

const eurIcon = <IconCurrencyEuro style={{ width: rem(20), height: rem(20) }} stroke={1.5} />;

const sortOptions = [{
  label: 'Aktuellste Angebote',
  value: 'date'
}, {
  label: 'Gerinster Preis',
  value: 'priceAsc'
}, {
  label: 'Höchster Preis',
  value: 'priceDesc'
}, {
  label: 'Kleinste Fläche',
  value: 'sizeAsc'
}, {
  label: 'Größte Fläche',
  value: 'sizeDesc'
}]

const SortInput = ({ sortValue, updateSort, mb = 0 }) => <Select
  label="Sortieren nach"
  data={sortOptions}
  value={sortValue}
  onChange={(_sort, option) => updateSort(option.value)}
  mb={mb}
  w={{ base: '100%', xs: 'auto' }}
/>

const Filter = ({ filter, setFilter, applyFilter }) => {
  const [opened, { toggle }] = useDisclosure(false);
  return <>
    <Flex gap="sm" align="center" mb="sm">
      <NumberInput
        label="Min. Preis"
        placeholder="Beliebig"
        rightSection={eurIcon}
        min={0}
        max={filter.maxPrice || Infinity}
        value={filter.minPrice}
        onChange={(value) => setFilter({ ...filter, minPrice: value })}
      />
      <Text mt="md">bis</Text>
      <NumberInput
        label="Max. Preis"
        placeholder="Beliebig"
        rightSection={eurIcon}
        min={filter.minPrice || 1}
        value={filter.maxPrice}
        onChange={(value) => setFilter({ ...filter, maxPrice: value })}
      />
    </Flex>

    <Flex gap="sm" align="center" mb="sm">
      <NumberInput
        label="Min. Fläche"
        placeholder="Beliebig"
        min={0}
        max={filter.maxSize || Infinity}
        value={filter.minSize}
        onChange={(value) => setFilter({ ...filter, minSize: value })}
      />
      <Text mt="md">bis</Text>
      <NumberInput
        label="Max. Fläche"
        placeholder="Beliebig"
        min={filter.minSize || 1}
        value={filter.maxSize}
        onChange={(value) => setFilter({ ...filter, maxSize: value })}
      />
    </Flex>

    <Flex gap="sm" align="center" mb="sm">
      <NumberInput
        label="Min. Zimmer"
        placeholder="Beliebig"
        min={0}
        max={filter.maxRooms || Infinity}
        value={filter.minRooms}
        onChange={(value) => setFilter({ ...filter, minRooms: value })}
      />
      <Text mt="md">bis</Text>
      <NumberInput
        label="Max. Zimmer"
        placeholder="Beliebig"
        min={filter.minRooms || 1}
        value={filter.maxRooms}
        onChange={(value) => setFilter({ ...filter, maxRooms: value })}
      />
    </Flex>

    {!opened &&
      <Text c="blue" td="underline"onClick={toggle} style={{ cursor: 'pointer' }}>Erweiterte Filter</Text>
    }

    <Collapse in={opened}>
      <TextInput
        label="Titel enthält"
        placeholder="Suche nach bestimmten Text"
        value={filter.titleIncludes}
        onChange={(event) => setFilter({ ...filter, titleIncludes: event.currentTarget.value })}
        mb="sm"
      />
      <TextInput
        label="Titel enthält nicht"
        placeholder="Schließe bestimmten Text aus"
        value={filter.titleExcludes}
        onChange={(event) => setFilter({ ...filter, titleExcludes: event.currentTarget.value })}
        mb="sm"
      />

      <Text size="sm" fw={500} mb="sm">Anbieter</Text>

      {providers.map(p => <Checkbox
        mb="sm"
        key={p.id}
        label={p.label}
        checked={!filter.providers?.includes(p.id)}
        onChange={(event) => {
          if (!event.currentTarget.checked) {
            setFilter((prevFilter) => ({
              ...prevFilter,
              providers: [...(prevFilter.providers || []), p.id],
            }));
          } else {
            setFilter((prevFilter) => ({
              ...prevFilter,
              providers: prevFilter.providers?.filter((f) => f !== p.id),
            }));
          }
        }}
      />)}

      <Text size="sm" fw={500} mb="sm">Ausstattung</Text>

      <Flex wrap="wrap" gap="xs">
        {Object.entries(featureMap).map(([featureKey, featureValue]) => (
          <Checkbox
            key={featureKey}
            label={featureValue}
            checked={filter.features?.includes(featureKey)}
            onChange={(event) => {
              if (event.currentTarget.checked) {
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  features: [...(prevFilter.features || []), featureKey],
                }));
              } else {
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  features: prevFilter.features?.filter((f) => f !== featureKey),
                }));
              }
            }}
          />
        ))}
      </Flex>
    </Collapse>

    <Button onClick={applyFilter} mt="md">
      Filter Anwenden
    </Button>
  </>
}

export default function Search() {
  const router = useRouter()
  const { q, sort = 'date', page = '1', ...filterQuery } = (router.query || {})
  const pageInt = parseInt(page) || 1
  const filterString = Object.entries(filterQuery)
    .filter(([key, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const { data = {}, error, isLoading } = useSWR(`/api/search?q=${q}&sort=${sort}&${filterString}&page=${pageInt}`, fetcher)
  const { estates, pages = 0 } = data
  const sortValue = sortOptions.find((option) => option.value === sort)?.value || 'date'
  const [filterModalOpen, { open: openFilterModal, close: closeFilterModal }] = useDisclosure(false);

  const [filter, setFilter] = useState({
    minPrice: null,
    maxPrice: null,
    minSize: null,
    maxSize: null,
    minRooms: null,
    maxRooms: null,
    titleIncludes: '',
    titleExcludes: '',
    features: [],
    providers: [],
  })

  useEffect(() => {
    if (router.isReady) {
      filterQuery.features = filterQuery?.features?.split(',') || []
      filterQuery.providers = filterQuery?.providers?.split(',') || []
      setFilter({
        ...filter,
        ...filterQuery,
      })
    }
  }, [router.isReady, router.query]);

  const updateSort = (sort) => {
    router.push({ query: { ...router.query, sort, page: 1 } }) 
  }

  const setPage = (newPage) => {
    router.push({ query: { ...router.query, page: newPage } })
  }

  const applyFilter = () => {
    const query = { ...router.query, ...filter, page: 1 }
    query.features = query.features.join(',')
    query.providers = query.providers.join(',')
    Object.keys(query).forEach(key => !query[key] && delete query[key])
    if (filterModalOpen) {
      closeFilterModal()
    }
    router.push({ query })
  }

  return (
    <Layout
      title={`ImmoRadar | ${q} Suchergebnisse`}
      description="Kein mühsames Durchsuchen mehrerer Webseiten. Eine gut sortierte Liste ohne Duplikate und sofortige Updates bei neuen Angeboten."
    >
      <Box pt="xl" pb="md">
        <SearchBar defaultValue={q} />
      </Box>

      {/* only mobile design */}
      <Flex gap="md" direction={{ base: "column-reverse", xs: "row" }} display={{ base: 'flex', md: 'none' }} mb="md" align={{ base: "flex-start", xs: "flex-end" }} justify="space-between">
        <Flex gap="md">
          <Button leftSection={<IconAdjustmentsHorizontal size={14} />} variant="default" onClick={openFilterModal}>
            Filter
          </Button>
          <Button leftSection={<IconBell size={14} />} variant="default">
            Benachrichtigung
          </Button>
          <Modal opened={filterModalOpen} onClose={closeFilterModal} title="Filter">
            <Filter filter={filter} setFilter={setFilter} applyFilter={applyFilter} />
          </Modal>
        </Flex>
        <SortInput sortValue={sortValue} updateSort={updateSort} />
      </Flex>

      <Flex gap="md" direction={{ base: 'column', md: 'row' }}>
        <Box w={{ base: '100%', md: '66%' }}>
          {isLoading && <>
            {Array.from({ length: 5 }).map((_, i) => (
              <SearchItemLoader key={`loader-${i}`} index={i} />
            ))}
          </>}
          {estates && estates.length > 0 && estates.map((item) => <SearchItem key={item._id} item={item} />)}

          {estates && estates.length === 0 && <Text c="gray" mt="md">Keine Ergebnisse gefunden</Text>}
        </Box>

        {/* only desktop design */}
        <Box w="34%" display={{ base: 'none', md: 'block'}}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <SortInput sortValue={sortValue} updateSort={updateSort} mb="xs"/>

            <Divider my="md" />

            <Filter filter={filter} setFilter={setFilter} applyFilter={applyFilter} />
          </Card>
        </Box>
      </Flex>

      { pages > 1 && <Pagination total={pages} value={pageInt} onChange={setPage} mt="sm" mb="sm" /> }

    </Layout>
  );
}
