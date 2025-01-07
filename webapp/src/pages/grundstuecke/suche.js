import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Card, Flex, Select, Text, Button, Divider, Modal, Pagination, Title, Group, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAdjustmentsHorizontal, IconArrowLeft, IconArrowRight, IconArrowMergeBoth, IconBell, IconList } from '@tabler/icons-react'
import Layout from '@/components/Layout/Layout'
import SearchBar from '@/components/SearchBar/SearchBar';
import SearchItem from '@/components/SearchItem/SearchItem';
import Filter from '@/components/Filter/Filter';
import { fetcher } from '@/utils/fetcher'
import styles from '@/styles/Home.module.css'

// _____ SEARCH PAGE _____ //
const SearchPage = () => {
  return <Layout>
    <Box>
      <div className={styles.background}></div>

      <Flex py="6rem" mih="calc(100vh - 64px - 52px - 16px)" h="100%" direction="column" justify="space-evenly">
        <Box>
          <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 72 }} fw="bold" mb="lg" textWrap="balance">
            Alle <span className={styles.gradientText}>Grundstücke</span> an einem Ort
          </Title>

          <Group position="center">
            <SearchBar showFilter={true} />
          </Group>
        </Box>
        <Flex align={{ base: 'left' }} direction={{ base: 'column', sm: 'row' }} gap={{ base: 'xl' }} maw={{ base: "350px", sm: "100%"}}>
          <Flex align={{ base: 'left'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
            <ThemeIcon radius="sm" size="lg" variant="filled"><IconArrowMergeBoth size={24} /></ThemeIcon>
            <Text ta={{ base: 'left' }}>Kombiniert Ergebnisse von <b>verschiedenen Immobilien-Webseiten</b></Text>
          </Flex>
          <Flex align={{ base: 'left' }} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
            <ThemeIcon radius="sm" size="lg" variant="filled"><IconList size={24} /></ThemeIcon>
            <Text ta={{ base: 'left' }}>Eine einzige, gut sortierte Liste <b>ohne Duplikate</b></Text>
          </Flex>
          {/* <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
            <ThemeIcon radius="sm" size="lg" variant="filled"><IconBell size={24} /></ThemeIcon>
            <Text ta={{ base: 'left', sm: 'center'}}><b>Benachrichtigungen</b> bei neuen Angeboten</Text>
          </Flex> */}
        </Flex>
      </Flex>
    </Box>
  </Layout>
}

// _____ SEARCH RESULTS _____ //
const PaginationLeftIcon = ({ ...props }) => <IconArrowLeft {...props} aria-label="Zurück" />
const PaginationRightIcon = ({ ...props }) => <IconArrowRight {...props} aria-label="Weiter" />

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

function SearchResults({ estates, pages, count, defaultFilter, q, sortValue, pageInt }) {
  const router = useRouter();
  const [filterModalOpen, { open: openFilterModal, close: closeFilterModal }] = useDisclosure(false);

  useEffect(() => {
    if (window && window.umami) {
      umami.track('GrundstueckSuche', { q })
    }
  })

  const applyFilter = (filter) => {
    const query = { ...router.query, ...filter, page: 1 };
    query.providers = query.providers.join(',');
    query.titleIncludes = query.titleIncludes.join(',');
    query.titleExcludes = query.titleExcludes.join(',');
    Object.keys(query).forEach(key => !query[key] && delete query[key]);
    if (filterModalOpen) {
      closeFilterModal();
    }
    router.push({ query });
  };

  const updateSort = (sort) => {
    router.push({ query: { ...router.query, sort, page: 1 } });
  };

  const setPage = (newPage) => {
    router.push({ query: { ...router.query, page: newPage } });
  };

  return (
    <Layout
      title={`Alle Grundstücke in ${q} | ImmoRadar`}
      description={`Alle verfügbaren Grundstücke in ${q}. Eine gut sortierte Liste mit Grundstücken in ${q} von verschiedenen Anbietern ohne Duplikate.`}
      noindex={pageInt > 1 || sortValue !== 'date'}
    >
      { count > 0 && <Title pt="xl" size="h3" order={1} fw="500" >{count} Ergebnisse | Alle Grundstücke in {q}</Title> }
      <Box pt="md" pb="md">
        <SearchBar defaultValue={q} />
      </Box>

      {/* only mobile design */}
      <Flex gap="md" direction={{ base: "column-reverse", xs: "row" }} display={{ base: 'flex', md: 'none' }} mb="md" align={{ base: "flex-start", xs: "flex-end" }} justify="space-between">
        <Flex gap="md">
          <Button leftSection={<IconAdjustmentsHorizontal size={14} />} variant="default" onClick={openFilterModal}>
            Filter
          </Button>
          <Modal opened={filterModalOpen} onClose={closeFilterModal} title="Filter">
            <Filter defaultFilter={defaultFilter} applyFilter={applyFilter} />
          </Modal>
        </Flex>
        <SortInput sortValue={sortValue} updateSort={updateSort} />
      </Flex>

      <Flex gap="md" direction={{ base: 'column', md: 'row' }}>
        <Box w={{ base: '100%', md: '66%' }}>
          {estates && estates.length > 0 && estates.map((item) => <SearchItem key={item._id} item={item} />)}

          {estates && estates.length === 0 && <Text c="gray" mt="md">Keine Ergebnisse gefunden</Text>}
        </Box>

        {/* only desktop design */}
        <Box w="34%" display={{ base: 'none', md: 'block'}} mb="xl">
          <Card shadow="sm" padding="md" radius="md" mb="md" withBorder>
            <SortInput sortValue={sortValue} updateSort={updateSort} mb="xs"/>

            <Divider my="md" />

            <Filter defaultFilter={defaultFilter} applyFilter={applyFilter} />
          </Card>
        </Box>
      </Flex>

      { pages > 1 && <Pagination
        total={pages}
        value={pageInt}
        onChange={setPage}
        mt="sm" mb="sm"
        previousIcon={PaginationLeftIcon}
        nextIcon={PaginationRightIcon}
      /> }
    </Layout>
  );
}

export default function Search ({ estates, pages, count, defaultFilter, q, sortValue, pageInt }) {
  if (q) {
    return <SearchResults estates={estates} pages={pages} count={count} defaultFilter={defaultFilter} q={q} sortValue={sortValue} pageInt={pageInt} />
  } else {
    return <SearchPage />
  }
}

export async function getServerSideProps(context) {
  const { query } = context;
  if (query && query.q) {
    const { q, sort = 'date', page = '1', ...filterQuery } = query;
    const pageInt = parseInt(page) || 1;
    const filterString = Object.entries(filterQuery)
      .filter(([key, value]) => !!value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  
    const [data] = await Promise.all([
      fetcher(`${process.env.BASE_URL}/api/property-search?q=${q}&sort=${sort}&${filterString}&page=${pageInt}`),
    ]);
  
    const { estates, pages = 0, count = 0 } = data;
  
    const newProviders = filterQuery?.providers?.split(',') || [];
    const newTitleIncludes = filterQuery?.titleIncludes?.split(',') || [];
    const newTitleExcludes = filterQuery?.titleExcludes?.split(',') || [];
  
    const defaultFilter = {
      ...filterQuery,
      providers: newProviders,
      titleIncludes: newTitleIncludes,
      titleExcludes: newTitleExcludes,
    };
  
    return {
      props: {
        estates,
        pages,
        count,
        defaultFilter,
        q,
        sortValue: sort,
        pageInt,
        filterQuery,
      },
    };
  } else {
    return { props: {} }
  }
}