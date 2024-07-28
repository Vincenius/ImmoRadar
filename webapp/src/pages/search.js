import { useState, useEffect } from 'react';
import useSWR from 'swr'
import { useRouter } from 'next/router';
import { Box, Card, Flex, Select, NumberInput, Text, Button, Divider, TextInput, Modal, Pagination } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconAdjustmentsHorizontal, IconBell } from '@tabler/icons-react'
import Layout from '@/components/Layout/Layout'
import SearchBar from '@/components/SearchBar/SearchBar';
import SearchItem from '@/components/SearchItem/SearchItem';
import SearchItemLoader from '@/components/SearchItem/SearchItemLoader';
import Filter from '@/components/Filter/Filter';
import { fetcher } from '@/utils/fetcher'

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

const Notifications = ({ filter, query }) => {
  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newFeatures = filter?.features?.split(',') || [];
    const newProviders = filter?.providers?.split(',') || [];

    const parsedFilter = {
      minPrice: filter.minPrice && parseInt(filter.minPrice),
      maxPrice: filter.maxPrice && parseInt(filter.maxPrice),
      minSize: filter.minSize && parseInt(filter.minSize),
      maxSize: filter.maxSize && parseInt(filter.maxSize),
      minRooms: filter.minRooms && parseInt(filter.minRooms),
      maxRooms: filter.maxRooms && parseInt(filter.maxRooms),
      features: newFeatures,
      providers: newProviders,
    };

    const filteredFilter = Object.entries(parsedFilter).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== false && value !== '' && (Array.isArray(value) ? value.length > 0 : true)) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const manualInput = filter.input === 'manual';

    fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, frequency, filter: filteredFilter, query, manualInput }),
    })
    .then(res => res.json())
    .then((res) => {
      setIsLoading(false);
      if (res.success) {
        setEmail('');
        setFrequency(1);
        notifications.show({
          color: 'green',
          title: 'Erfolgreich abonniert',
          message: res.newAccount
            ? 'Überprüfe deine E-Mails um dein Abonnement zu bestätigen'
            : 'Benauchrichtigungen wurden erfolgreich aktiviert',
        })
      } else {
        notifications.show({
          color: 'red',
          title: res.duplicate
            ? 'Abonnement existiert bereits'
            : 'Etwas ist schief gelaufen...',
          message: res.duplicate
            ? 'Du hast bereits ein Abonnement mit diesen Filtern'
            : 'Versuche es erneut oder kontaktiere den Support',
        })
      }
    });
  };

  return <form onSubmit={submit}>
    <Card p="sm" bg="cyan.1" radius="sm" mb="sm" shadow="none" opacity={0.7}>
      <Text size="sm" fs="italic">
        Erhalte alle neuen Angebote basierend auf deinen Filtern per E-Mail.
        Bestimme selbst, wie oft du E-Mails erhalten möchtest.
      </Text>
    </Card>

    <TextInput
      label="E-Mail Adresse"
      placeholder="deine-email@gmail.com"
      mb="md"
      value={email}
      onChange={e => setEmail(e.target.value)}
      type="email"
      required
    />

    <NumberInput
      min={1}
      max={30}
      label="Häufigkeit (alle x Tage)"
      mb="md" value={frequency}
      onChange={val => setFrequency(val)}
      required
    />

    <Button loading={isLoading} type="submit">
      Abonnieren
    </Button>
  </form>
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
  const [notificationModalOpen, { open: openNotificationModal, close: closeNotificationModal }] = useDisclosure(false);
  const [defaultFilter, setDefaultFilter] = useState()

  useEffect(() => {
    if (router.isReady) {
      const newFeatures = filterQuery?.features?.split(',') || []
      const newProviders = filterQuery?.providers?.split(',') || []
      setDefaultFilter({
        ...filterQuery,
        features: newFeatures,
        providers: newProviders,
      })
    }
  }, [router.isReady, router.query]);

  const applyFilter = (filter) => {
    const query = { ...router.query, ...filter, page: 1 }
    query.features = query.features.join(',')
    query.providers = query.providers.join(',')
    Object.keys(query).forEach(key => !query[key] && delete query[key])
    if (filterModalOpen) {
      closeFilterModal()
    }
    router.push({ query })
  }

  const updateSort = (sort) => {
    router.push({ query: { ...router.query, sort, page: 1 } })
  }

  const setPage = (newPage) => {
    router.push({ query: { ...router.query, page: newPage } })
  }

  return (
    <Layout
      title={`ImmoRadar | ${q || ''} Suchergebnisse`}
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
          <Button leftSection={<IconBell size={14} />} variant="default" onClick={openNotificationModal}>
            Benachrichtigungen
          </Button>
          <Modal opened={filterModalOpen} onClose={closeFilterModal} title="Filter">
            <Filter defaultFilter={defaultFilter} applyFilter={applyFilter} />
          </Modal>
          <Modal opened={notificationModalOpen} onClose={closeNotificationModal} title="Benachrichtigungen">
            <Notifications filter={filterQuery} query={q} />
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
          <Card shadow="sm" padding="md" radius="md" mb="md" withBorder>
            <SortInput sortValue={sortValue} updateSort={updateSort} mb="xs"/>

            <Divider my="md" />

            <Filter defaultFilter={defaultFilter} applyFilter={applyFilter} />
          </Card>

          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Flex gap="sm" align="center" mb="sm"><IconBell size={16} /> <Text fw={500}>Benachrichtigungen</Text></Flex>
            <Notifications filter={filterQuery} query={q} />
          </Card>
        </Box>
      </Flex>

      { pages > 1 && <Pagination total={pages} value={pageInt} onChange={setPage} mt="sm" mb="sm" /> }

    </Layout>
  );
}
