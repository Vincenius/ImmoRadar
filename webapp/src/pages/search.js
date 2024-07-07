import useSWR from 'swr'
import { useRouter } from 'next/router';
import { Box, Card, Flex } from '@mantine/core';
import Layout from '@/components/Layout/Layout'
import SearchBar from '@/components/SearchBar/SearchBar';
import SearchItem from '@/components/SearchItem/SearchItem';
import SearchItemLoader from '@/components/SearchItem/SearchItemLoader';
import { fetcher } from '@/utils/fetcher'

export default function Search() {
  const router = useRouter()
  const { q } = (router.query || {})
  const { data, error, isLoading } = useSWR(`/api/search?q=${q}`, fetcher)

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
            todo filter
            {/* price from - to */}
            {/* size from - to */}
            {/* rooms */}
            {/* features */}
          </Card>
        </Box>
      </Flex>
    </Layout>
  );
}
