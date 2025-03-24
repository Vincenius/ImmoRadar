import Layout from "@/components/Layout/Layout"
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

  if (status === "loading" || isLoading) {
    return <Layout title="Mietvertrag Generator">
      <Flex h="70vh" w="100%" align="center" justify="center">
        <Loader size={30} />
      </Flex>
    </Layout>
  }

  const editId = router.query?.edit
  const defaultData = editId ? data.find(d => d._id === editId) : null
  const mappedDefaultData = defaultData ? {
    ...defaultData,
    rentStart: new Date(defaultData.rentStart),
    visitedDate: new Date(defaultData.visitedDate),
    rentSteps: defaultData.rentSteps ? defaultData.rentSteps.map(r => ({ ...r, date: new Date(r.date) })) : null,
  } : {}

  return (
    <Layout title="Mietvertrag Generator">
      { !editId && <Title mb="xl" fw="lighter" size="3em">Mietvertrag Generator</Title> }
      { editId && <Title mb="xl" fw="lighter" size="3em">Mietvertrag Bearbeiten</Title> }

      {/* todo pre step select estate (if not edit view) */}
      <ContractWizard isAuthenticated defaultData={mappedDefaultData} />
    </Layout>
  )
}

export default MietvertragGenerator
