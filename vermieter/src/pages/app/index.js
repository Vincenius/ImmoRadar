import Layout from "@/components/Layout/Layout"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from 'next/router';
import { Loader, Flex, Text, Button } from "@mantine/core";

function App() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login')
    },
  })
  
  if (status === "loading") {
    return <Layout title="Dashboard">
      <Flex h="70vh" w="100%" align="center" justify="center">
        <Loader size={30} />
      </Flex>
    </Layout>
  }

  console.log(session, status)

  return (
     <Layout title="Dashboard" hideLogin={true}>
        <Text mb="md">Hier kommt der Bereich für registrierte Nutzer!</Text>
        <Button onClick={() => signOut()}>Logout</Button>
     </Layout>
  )
}

export default App
