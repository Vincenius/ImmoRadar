import { useState } from 'react'
import Link from "next/link";
import { Flex, Title, TextInput, Button, Text } from '@mantine/core';
import LoginCard from "@/components/LoginCard/LoginCard";
import Layout from '@/components/Layout/Layout';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [unexpectedError, setUnexpectedError] = useState();
  const [error, setError] = useState(null)
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
    fetch('/api/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        ...formObject,
        token: router.query?.token
      }),
    }).then(res => {
      if (res.status === 200) {
        setIsSuccess(true)
      } else {
        setError('Der Link ist abgelaufen.')
      }
      
    }).catch((err) => {
      setUnexpectedError('Ein unerwarteter Fehler ist aufgetreten')
      console.error(err)
    }).finally(() => {
      setIsLoading(false)
    })
  }

  return (
    <Layout title={`Passwort zurücksetzten | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}>
      <LoginCard>
        <Title ta="center" fw="lighter" mb="xl">Passwort zurücksetzten</Title>

        {!isSuccess && <form onSubmit={handleSubmit}>
          <TextInput name="password" size="md" label="Neues Passwort" type="password" mb="md" required />

          <Button size="lg" mb="xl" fullWidth loading={isLoading} type="submit">Passwort zurücksetzten</Button>
          {unexpectedError && <Text c="red.9" mb="lg">{unexpectedError}</Text>}
        </form> }

        {error && <Text c="red.9" mb="lg">{error}</Text>}

        {isSuccess && <Flex direction="column" gap="md" align="center">
          <Text fw="bold">Dein Passwort wurde erfolgreich zurückgesetzt</Text>
          <Text>Du kannst dich jetzt mit dem neuen Passwort einloggen.</Text>
        </Flex>}

        <Flex gap="md" justify="space-between" mt="md">
          <Link href="/login">Einloggen</Link>
        </Flex>
      </LoginCard>
    </Layout>
  );
}
