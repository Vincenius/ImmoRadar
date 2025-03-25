import Layout from "@/components/Layout/AppLayout"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router';
import { Loader, Flex, Title } from "@mantine/core";
import ContractWizard from "@/components/ContractWizard/ContractWizard"
import useSWR from 'swr'
import { fetcher } from "@/utils/fetcher";
import { useEffect } from "react";

function MietvertragGenerator() {
  const router = useRouter();
  const { data: session, status, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login')
    },
  })

  useEffect(() => {
    if (session && session.user && session.user.plan !== 'year') {
      router.replace('/mietvertrag-generator')
    }
  }, [session])

  const { data = [], isLoading } = useSWR('/api/user-contracts', fetcher)
  const { data: estatesData = [], isLoading: estatesLoading } = useSWR('/api/user-estates', fetcher)
  const { data: userData = {}, isLoading: userDataLoading } = useSWR('/api/user', fetcher)
  const defaultUserData = {
    bankAccount: userData.bankAccount, landlordCity: userData.landlordCity,
    landlordName: userData.landlordName, landlordRepresentedBy: userData.landlordRepresentedBy,
    landlordStreet: userData.landlordStreet, landlordZip: userData.landlordZip
  }

  if (status === "loading" || isLoading || estatesLoading || userDataLoading) {
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
      ? { ...defaultUserData, ...estatesData.find(e => e._id === estateId) }
      : defaultUserData

  const mappedDefaultData = defaultData ? {
    ...defaultData,
    rentStart: defaultData.rentStart ? new Date(defaultData.rentStart) : null,
    visitedDate: defaultData.visitedDate ? new Date(defaultData.visitedDate) : null,
    rentSteps: defaultData.rentSteps ? defaultData.rentSteps.map(r => ({ ...r, date: new Date(r.date) })) : null,
  } : {}

  console.log(mappedDefaultData)

  return (
    <Layout title="Mietvertrag Generator">
      {!editId && <Title order={1} size="h3" weight={500} mb="xl">Mietvertrag Generator</Title>}
      {editId && <Title order={1} size="h3" weight={500} mb="xl">Mietvertrag Bearbeiten</Title>}

      <ContractWizard isAuthenticated defaultData={mappedDefaultData} isEdit={!!editId} />
    </Layout>
  )
}

export default MietvertragGenerator
