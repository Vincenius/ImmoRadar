import Head from "next/head";
import Link from "next/link";
import { Flex, Title, TextInput, Button, Checkbox, Text } from '@mantine/core';
import LoginCard from "@/components/LoginCard";

export default function Home() {
  return (
    <>
      <Head>
        <title>Registrieren | ImmoRadar</title>
        <meta name="description" content="Logge dich in dein ImmoRadar Account ein." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main>
        <LoginCard>
          <Title ta="center" fw="lighter" mb="xl">Registrieren</Title>

          <TextInput size="md" placeholder="mustermann@example.com" label="E-Mail Adresse" type="email" mb="md" />
          <TextInput size="md" label="Passwort" type="password" mb="md" />

          <Checkbox
            size="md"
            mb="lg"
            required
            label={<Text>Ich habe die <Link href="https://immoradar.xyz/datenschutz">Datenschutzbestimmungen</Link> gelesen und stimme ihnen zu.</Text>}
          />

          <Button size="lg" mb="xl" fullWidth>Account Erstellen</Button>

          <Flex gap="md" justify="space-between" mt="md">
            <Link href="/login">Einloggen</Link>
          </Flex>
        </LoginCard>
      </main>
    </>
  );
}
