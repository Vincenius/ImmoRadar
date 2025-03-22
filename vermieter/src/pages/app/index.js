import Layout from "@/components/Layout/Layout"
import { useSession, signOut, getToken } from "next-auth/react"
import { useRouter } from 'next/router';
import { useEffect } from "react"
import { Loader, Flex, Text, Button } from "@mantine/core";
import { notifications } from '@mantine/notifications';

function App() {
  const router = useRouter();
  const { token } = router.query
  const { data: session, status, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login')
    },
  })

  useEffect(() => {
    if (status === 'authenticated' && token) {
      console.log(session.user)
      if (session.user.plan === 'year') {
        router.replace('/app')
      } else {
        fetch('/api/upgrade-plan', {
          method: 'POST',
          body: JSON.stringify({ token })
        }).then(res => {
          if (res.status === 200) {
            update()
            notifications.show({
              title: 'Jahresabo abgeschlossen',
              message: 'Vielen Dank! Deine Abo wurde dem Account hinzugefügt.',
              color: 'green',
              position: 'top-center',
            });
          } else if (res.status === 409 || res.status === 400) {
            router.replace('/app')
            notifications.show({
              title: 'Unerwarteter Fehler',
              message: 'Bitte versuche es erneut. Sollte der Fehler weiterhin bestehen, kontaktiere uns per E-Mail.',
              color: 'red',
              position: 'top-center',
            });
          }
        }) 
      }
    }
  }, [token, status])

  console.log(session)
  
  if (status === "loading" || token) {
    return <Layout title="Dashboard">
      <Flex h="70vh" w="100%" align="center" justify="center">
        <Loader size={30} />
      </Flex>
    </Layout>
  }

  return (
     <Layout title="Dashboard" hideLogin={true}>
        <Text mb="md">Hier kommt der Bereich für registrierte Nutzer!</Text>
        {/* todo abo abschließen */}
        {/* du hast bereits ab? klicke link in email */}

        {/* todo dashboard */}
        <Button onClick={() => signOut()}>Logout</Button>
     </Layout>
  )
}

export default App
