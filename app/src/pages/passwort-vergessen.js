import Head from "next/head";
import Link from "next/link";
import { Flex, Title, TextInput, Button } from '@mantine/core';
import LoginCard from "@/components/LoginCard";

export default function Home() {
  return (
    <>
      <Head>
        <title>Login | ImmoRadar</title>
        <meta name="description" content="Logge dich in dein ImmoRadar Account ein." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main>
        <LoginCard>
          <Title ta="center" fw="lighter" mb="xl">Passwort vergessen</Title>

          <TextInput size="md" placeholder="mustermann@example.com" label="E-Mail Adresse" type="email" mb="md" />

          <Button size="lg" mb="xl" fullWidth>Passwort zurücksetzten</Button>

          <Flex gap="md" justify="space-between" mt="md">
            <Link href="/registrieren">Registrieren</Link>
            <Link href="/login">Einloggen</Link>
          </Flex>
        </LoginCard>
      </main>
    </>
  );
}
