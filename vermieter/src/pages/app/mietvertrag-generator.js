import Layout from "@/components/Layout/Layout"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router';
import { Loader, Flex, Title } from "@mantine/core";
import ContractWizard from "@/components/ContractWizard/ContractWizard"

function App() {
  const router = useRouter();
  const { data: session, status, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login')
    },
  })

  
  if (status === "loading") {
    return <Layout title="Dashboard">
      <Flex h="70vh" w="100%" align="center" justify="center">
        <Loader size={30} />
      </Flex>
    </Layout>
  }

  return (
     <Layout title="Mietvertrag Generator">
        <Title mb="xl" fw="lighter" size="3em">Mietvertrag Generator</Title>

        {/* todo pre step select estate */}
        <ContractWizard isAuthenticated />
     </Layout>
  )
}

export default App
