import Layout from '@/components/Layout/Layout'
import { Title, Loader, Flex } from '@mantine/core'
import EstateForm from '@/components/EstateForm/EstateForm'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import { useRouter } from 'next/router'

function Immobilie() {
  const router = useRouter()
  const { data, isLoading } = useSWR('/api/user-estates', fetcher)

  return (
    <Layout title="Immobilie Bearbeiten">
      <Title order={1} size="h3" weight={500} mb="xl">Immobilie bearbeiten</Title>

      {isLoading && <Flex h="70vh" w="100%" align="center" justify="center">
        <Loader size={30} />
      </Flex>}
      {!isLoading && <EstateForm defaultData={data.find(d => d._id === router.query.id)} /> }
    </Layout>
  )
}

export default Immobilie
