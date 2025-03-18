import { useEffect, useState } from "react";
import Link from "next/link";
import { Flex, Title, TextInput, Button, Text } from '@mantine/core';
import LoginCard from "@/components/LoginCard/LoginCard";
import Layout from '@/components/Layout/Layout';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { signIn } from "next-auth/react"

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // TODO hook redirect to app wenn eingeloggt

  useEffect(() => {
    const { confirmed } = router.query;
    if (confirmed === 'true') {
      const { pathname, query } = router;
      notifications.show({
        title: 'E-Mail bestätigt',
        message: 'Vielen Dank! Deine E-Mail-Adresse wurde bestätigt.',
        color: 'green',
        position: 'top-center',
      });
      // Remove the confirm query param from the URL
      const params = new URLSearchParams(query);
      params.delete('confirmed');
      router.replace(
        { pathname, query: params.toString() },
        undefined,
        { shallow: true }
      );
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    setError(null)

    const formObject = {};
    const elements = e.target.elements;
    for (let element of elements) {
      if (element.name && element.value) {
        formObject[element.name] = element.value;
      }
    }
    const result = await signIn('credentials', { email: formObject.email, password: formObject.password, redirect: false })
    console.log(result)
    if (result.status === 401) {
      setError('Benutzername oder Passwort ist falsch')
    }
    if (result.status === 200) {
      router.push('/app')
    }

    setIsLoading(false)
  }


  return (
    <Layout title={`Login | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}>
      <LoginCard>
        <Title ta="center" fw="lighter" mb="xl">Login</Title>

        <form onSubmit={handleSubmit}>
          <TextInput name="email" size="md" placeholder="mustermann@example.com" label="E-Mail Adresse" type="email" mb="md" required />
          <TextInput name="password" size="md" label="Passwort" type="password" mb="lg" required />

          <Button size="lg" mb={error ? "md" : "xl"} fullWidth type="submit" loading={isLoading}>Einloggen</Button>

          {error && <Text mb="xl" c="red.9">{error}</Text>}
        </form>

        <Flex gap="md" justify="space-between" mt="md">
          <Link href="/registrieren">Registrieren</Link>
          <Link href="/passwort-vergessen">Passwort vergessen</Link>
        </Flex>
      </LoginCard>
    </Layout>
  );
}
