import Layout from "@/components/Layout/AppLayout"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router';
import { Loader, Flex, Title } from "@mantine/core";
import ContractWizard from "@/components/ContractWizard/ContractWizard"
import useSWR from 'swr'
import { fetcher } from "@/utils/fetcher";

function MietvertragGenerator() {
  const router = useRouter();
  const { data: session, status, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login')
    },
  })

  const { data = [], isLoading } = useSWR('/api/user-contracts', fetcher)
  const { data: estatesData = [], isLoading: estatesLoading } = useSWR('/api/user-estates', fetcher)

  if (status === "loading" || isLoading || estatesLoading) {
    return <Layout title="Mietvertrag Generator">
      <Flex h="70vh" w="100%" align="center" justify="center">
        <Loader size={30} />
      </Flex>
    </Layout>
  }

  const editId = router.query?.edit
  const estateId = router.query?.estate
  const defaultData = editId
    ? data.find(d => d._id === editId)
    : estateId
      ? estatesData.find(e => e._id === estateId)
      : null

  const mappedDefaultData = defaultData ? {
    ...defaultData,
    rentStart: defaultData.rentStart ? new Date(defaultData.rentStart) : null,
    visitedDate: defaultData.visitedDate ? new Date(defaultData.visitedDate) : null,
    rentSteps: defaultData.rentSteps ? defaultData.rentSteps.map(r => ({ ...r, date: new Date(r.date) })) : null,
  } : {}

  return (
    <Layout title="Mietvertrag Generator">
      { !editId && <Title mb="xl" fw="lighter" size="3em">Mietvertrag Generator</Title> }
      { editId && <Title mb="xl" fw="lighter" size="3em">Mietvertrag Bearbeiten</Title> }

      <ContractWizard isAuthenticated defaultData={mappedDefaultData} isEdit={!!editId} />
    </Layout>
  )
}

export default MietvertragGenerator
