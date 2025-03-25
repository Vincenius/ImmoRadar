import Layout from "@/components/Layout/AppLayout"
import Link from "next/link";
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router';
import { useEffect, useState } from "react"
import { Loader, Flex, Text, Button, Title, Box, Card } from "@mantine/core";
import { notifications } from '@mantine/notifications';
import Pricing from "@/components/Pricing/Pricing";
import Checkout from "@/components/Checkout/Checkout";
import ContractCards from "@/components/ContractCards/ContractCards";
import EstateCards from "@/components/EstateCards/EstateCards";

function App() {
  const router = useRouter();
  const [isCheckout, setIsCheckout] = useState();
  const { token } = router.query
  const { data: session, status, update } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && token) {
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

  if (status === "loading" || token || !session) {
    return <Layout title="Dashboard">
      <Flex h="70vh" w="100%" align="center" justify="center">
        <Loader size={30} />
      </Flex>
    </Layout>
  }

  const { user } = session

  if (user.plan !== 'year') {
    return (
      <Layout title="Dasboard">
        <Title order={1} size="h3" align="center" weight={500} mb="xl">Entdecke alle Funktionen mit unserem Jahresabo!</Title>
        {!isCheckout && <>
          <Box maw="500px" m="0 auto" mb="md">
            <Pricing onlySubscription={true} cta2={<Button onClick={() => setIsCheckout(true)} fullWidth>Jetzt freischalten</Button>} />
          </Box>
          <Text c="dimmed" ta="center">Du hast bereits ein Abo abgeschlossen? Nutze den Link in deiner E-Mail.</Text>
        </>}

        {isCheckout && <Card shadow="lg" withBorder w="100%">
          <Checkout variant="yearly" defaultEmail={user.email}/>
        </Card>}
      </Layout>
    )
  }

  return (
    <Layout title="Deine Verträge">
      <Title order={1} size="h3" weight={500} mb="md">Deine Verträge</Title>
      <ContractCards maxContracts={2} />
      <Button variant="transparent" mt="md" component={Link} href="/app/vertraege" mb="xl">Alle Verträge anzeigen</Button>

      <Title order={1} size="h3" weight={500} mb="md">Deine Immobilien</Title>
      <EstateCards maxCards={2} />
      <Button variant="transparent" mt="md" component={Link} href="/app/immobilien">Alle Immobilien anzeigen</Button>
    </Layout>
  )
}

export default App
