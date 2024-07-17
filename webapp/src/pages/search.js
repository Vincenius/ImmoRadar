import { useState } from 'react';
import useSWR from 'swr'
import { useRouter } from 'next/router';
import { Box, Card, Flex, Select, NumberInput, rem, Text, Button, Divider, Collapse, Checkbox } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCurrencyEuro } from '@tabler/icons-react'
import Layout from '@/components/Layout/Layout'
import SearchBar from '@/components/SearchBar/SearchBar';
import SearchItem from '@/components/SearchItem/SearchItem';
import SearchItemLoader from '@/components/SearchItem/SearchItemLoader';
import { fetcher } from '@/utils/fetcher'
import { featureMap } from '@/utils/featureMap'

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

export default function Search() {
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter()
  const { q, sort = 'date', ...filterQuery } = (router.query || {})
  const filterString = Object.entries(filterQuery)
    .filter(([key, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const { data, error, isLoading } = useSWR(`/api/search?q=${q}&sort=${sort}&${filterString}`, fetcher)
  const sortValue = sortOptions.find((option) => option.value === sort)?.value || 'date'
  const [filter, setFilter] = useState({
    minPrice: null,
    maxPrice: null,
    minSize: null,
    maxSize: null,
    minRooms: null,
    maxRooms: null,
    features: [],
  })

  const updateSort = (sort) => {
    router.push({ query: { ...router.query, sort } }) 
  }

  const applyFilter = () => {
    const query = { ...router.query, ...filter }
    Object.keys(query).forEach(key => query[key] === null && delete query[key])
    router.push({ query })
  }

  return (
    <Layout
      title="ImmoRadar | Alle Immobilienangebote an einem Ort"
      description="Kein mühsames Durchsuchen mehrerer Webseiten. Eine gut sortierte Liste ohne Duplikate und sofortige Updates bei neuen Angeboten."
    >
      <Box pt="xl" pb="md">
        <SearchBar defaultValue={q} />
      </Box>

      <Flex gap="md">
        <Box w="66%">
          {isLoading && <>
            {Array.from({ length: 5 }).map((_, i) => (
              <SearchItemLoader key={`loader-${i}`} index={i} />
            ))}
          </>}
          {data && data.map((item) => <SearchItem key={item._id} item={item} />)}
        </Box>
        <Box w="34%">
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Select
              label="Sortieren nach"
              data={sortOptions}
              value={sortValue}
              onChange={(_sort, option) => updateSort(option.value)}
              mb="xs"
            />

            <Divider my="md" />

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

            {/* rooms */}
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
              {/* todo questionmark indicator explain */}
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

            {/* title include string */}
            {/* title exclude string */}
            <Button onClick={applyFilter} mt="md">
              Filter Anwenden
            </Button>
          </Card>
        </Box>
      </Flex>
    </Layout>
  );
}
