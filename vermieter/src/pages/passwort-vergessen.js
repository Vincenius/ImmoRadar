import { useState } from 'react'
import Link from "next/link";
import { Flex, Title, TextInput, Button, Text } from '@mantine/core';
import LoginCard from "@/components/LoginCard/LoginCard";
import Layout from '@/components/Layout/Layout';
import useAuthRedirect from '@/utils/useAuthRedirect';

export default function ForgotPassword() {
  useAuthRedirect()
  const [isLoading, setIsLoading] = useState(false);
  const [unexpectedError, setUnexpectedError] = useState();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    setUnexpectedError(null)

    const formObject = {};
    const elements = e.target.elements;
    for (let element of elements) {
      if (element.name && element.value) {
        formObject[element.name] = element.value;
      }
    }
    fetch('/api/forgot-password', {
      method: 'POST',
      body: JSON.stringify(formObject),
    }).then(res => {
      setIsSuccess(true)
    }).catch((err) => {
      setUnexpectedError('Ein unerwarteter Fehler ist aufgetreten')
      console.error(err)
    }).finally(() => {
      setIsLoading(false)
    })
  }


  return (
    <Layout title={`Passwort vergessen | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}>
      <LoginCard>
        <Title ta="center" fw="lighter" mb="xl">Passwort vergessen</Title>

        {!isSuccess && <form onSubmit={handleSubmit}>
          <TextInput name="email" size="md" placeholder="mustermann@example.com" label="E-Mail Adresse" type="email" mb="md" />

          <Button size="lg" mb="xl" fullWidth loading={isLoading} type="submit">Passwort zurücksetzten</Button>
          {unexpectedError && <Text c="red.9" mb="lg">{unexpectedError}</Text>}
        </form> }

        {isSuccess && <Flex direction="column" gap="md" align="center">
          <Text fw="bold">Dein Account wurde erfolgreich zurückgesetzt</Text>
          <Text>Bitte prüfe dein E-Mail Konto und nutze den Link um ein neues Passwort zu erstellen.</Text>
        </Flex>}

        <Flex gap="md" justify="space-between" mt="md">
          <Link href="/registrieren">Registrieren</Link>
          <Link href="/login">Einloggen</Link>
        </Flex>
      </LoginCard>
    </Layout>
  );
}
