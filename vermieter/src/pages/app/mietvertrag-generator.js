import Layout from "@/components/Layout/Layout"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router';
import { Loader, Flex } from "@mantine/core";

function App() {
  const router = useRouter();
  const { token } = router.query
  const { data: session, status, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login')
    },
  })

  
  if (status === "loading" || token) {
    return <Layout title="Dashboard">
      <Flex h="70vh" w="100%" align="center" justify="center">
        <Loader size={30} />
      </Flex>
    </Layout>
  }

  return (
     <Layout title="Dashboard" hideLogin={true}>
        {/* TODO */}
     </Layout>
  )
}

export default App
