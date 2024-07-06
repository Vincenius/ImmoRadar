import useSWR from 'swr'
import { useRouter } from 'next/router';
import { Box, Grid, Card, Flex } from '@mantine/core';
import Layout from '@/components/Layout/Layout'
import SearchBar from '@/components/SearchBar/SearchBar';
import { fetcher } from '@/utils/fetcher'

export default function Search() {
  const router = useRouter()
  const { q } = (router.query || {})
  const { data, error, isLoading } = useSWR(`/api/search?q=${q}`, fetcher)

  console.log(data)

  return (
    <Layout
      title="ImmoRadar | Alle Immobilienangebote an einem Ort"
      description="Kein mühsames Durchsuchen mehrerer Webseiten. Eine gut sortierte Liste ohne Duplikate und sofortige Updates bei neuen Angeboten."
    >
      <Box py="xl">
        <SearchBar defaultValue={q} />
      </Box>

      <Grid>
        <Grid.Col span={8}>
          {data && data.map((item) => (
            <Card shadow="sm" padding="lg" radius="md" withBorder mb="md" key={item.id}>
              <Flex justify="space-between">
                <h2>{item.title}</h2>
                <p>{item.created_at}</p>
              </Flex>
            </Card>
          ))}
        </Grid.Col>
        <Grid.Col span={4}>
          Filter & signup
        </Grid.Col>
      </Grid>
    </Layout>
  );
}
