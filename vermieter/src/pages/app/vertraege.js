import Layout from "@/components/Layout/Layout"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router';
import { Loader, Flex, Title } from "@mantine/core";
import ContractCards from "@/components/ContractCards/ContractCards";

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
     <Layout title="Dashboard">
      <Title order={1} size="h3" weight={500} mb="xl">Deine Verträge</Title>
      <ContractCards />
     </Layout>
  )
}

export default App
