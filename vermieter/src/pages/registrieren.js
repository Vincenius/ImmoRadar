import { useState } from 'react'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router'
import Link from "next/link";
import { Flex, Title, TextInput, Button, Text } from '@mantine/core';
import Checkbox from '@/components/Inputs/Checkbox';
import LoginCard from "@/components/LoginCard/LoginCard";
import Layout from '@/components/Layout/Layout';
import useAuthRedirect from "@/utils/useAuthRedirect";

export default function Register() {
  useAuthRedirect()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState();
  const [error, setError] = useState();
  const { token } = router.query

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    setEmailError(null)
    setError(null)

    const formObject = { token };
    const elements = e.target.elements;
    for (let element of elements) {
      if (element.name && element.value) {
        formObject[element.name] = element.value;
      }
    }
    fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(formObject),
    }).then(res => res.json())
      .then(async res => {
        if (res.success === false) {
          if (res.message === 'UserExists') {
            setEmailError('E-Mail Adresse ist bereits vergeben')
          } else if (res.message === 'StripeUserExists') {
            setError('Es wurde bereits ein Nutzer für dieses Jahresabo erstellt. Bei Fragen kontaktiere uns per E-Mail.')
          } else if (res.message === 'StripeError') {
            setError('Ein unerwarteter Fehler ist aufgetreten. Falls das Problem weiterhin besteht, kontaktiere uns per E-Mail.')
          }
        } else {
          await signIn('credentials', { email: formObject.email, password: formObject.password, redirect: false })
          router.push('/app')
        }
      }).catch((err) => {
        setError('Ein unerwarteter Fehler ist aufgetreten')
        console.error(err)
      }).finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Layout title={`Registrieren | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}>
      <LoginCard>
        <Title ta="center" fw="lighter" mb="xl">Registrieren</Title>

        {token && <>
          <Text mb="md" fw="bold">Vielen Dank, dass du dich für das Jahresabo entschieden hast!</Text>

          <Text mb="md">Um dein Abo zu nutzen und den Vertrag herunterzuladen, erstelle bitte einen Account oder melde dich an, wenn du schon einen Account besitzt.</Text>
        </>}

        <form onSubmit={handleSubmit}>
          <TextInput name="email" size="md" placeholder="mustermann@example.com" label="E-Mail Adresse" type="email" mb="md" required error={emailError} />
          <TextInput name="password" size="md" label="Passwort" type="password" mb="md" required />

          <Checkbox
            size="md"
            mb="lg"
            required
            name="DataProtection"
            label={<Text>Ich habe die <Link href="/datenschutz">Datenschutzbestimmungen</Link> gelesen und stimme ihnen zu.</Text>}
          />

          <Button size="lg" mb="xl" fullWidth type="submit" loading={isLoading}>Account Erstellen</Button>
          {error && <Text c="red.9" mb="lg">{error}</Text>}
        </form>

        <Flex gap="md" justify="space-between" mt="md">
          <Link href={token ? `/login?token=${token}` : "/login"}>Einloggen</Link>
        </Flex>
      </LoginCard>
    </Layout>
  );
}
