import { useCallback, useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { Box, Button, Flex, Text, Title } from "@mantine/core";
import Checkbox from "@/components/Inputs/Checkbox";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout({ id, email, name, variant, goBack }) {
  const [hasConsent, setHasConsent] = useState(false);
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/api/checkout/session", {
      method: "POST",
      body: JSON.stringify({ id, email, variant, name }),
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasConsent(true)
  }


  return (
    <>
      {!hasConsent && <Box maw={800} mx="auto">
        <Title mb="md">Zustimmung zu den rechtlichen Bedingungen</Title>
        <Text mb="xl">Bevor du deine Bestellung abschließen kannst, benötigen wir deine Zustimmung zu unseren Allgemeinen Geschäftsbedingungen sowie zur Kenntnisnahme der Widerrufsbelehrung. Bitte bestätige beide Punkte, um fortzufahren.</Text>

        <Box>
          <form onSubmit={handleSubmit}>
            <Checkbox required mb="md" label="Ich stimme ausdrücklich zu, dass mit der Erfüllung des Vertrages (z. B. durch Bereitstellung des Downloads) vor Ablauf der Widerrufsfrist begonnen wird." />
            <Checkbox required mb="md" label="Mir ist bekannt, dass ich mit dieser Zustimmung mein gesetzliches Widerrufsrecht verliere." />
            <Checkbox required mb="xl" label={<>Ich habe die <Link href="/agbs" target="_blank">Allgemeinen Geschäftsbedingungen</Link> gelesen und akzeptiere sie.</>} />

            <Flex justify="space-between">
              {goBack && <Button variant="outline" onClick={() => goBack()} w="150px">Zurück</Button>}
              <Button type="submit">Weiter</Button>
            </Flex>
          </form>
        </Box>
      </Box>}
      {hasConsent && <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>}
      {hasConsent && goBack && <Button variant="outline" onClick={() => goBack()} w="150px" mt="md">Zurück</Button>}
    </>
  );
}
