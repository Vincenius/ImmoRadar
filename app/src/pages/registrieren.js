import { useState } from 'react'
import Head from "next/head";
import Link from "next/link";
import { Flex, Title, TextInput, Button, Text } from '@mantine/core';
import Checkbox from '@/components/Inputs/Checkbox';
import LoginCard from "@/components/LoginCard";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    
    const formObject = {};
    const elements = e.target.elements;
    for (let element of elements) {
      formObject[element.name] = element.value;
    }
    fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(formObject),
    }).then(() => {
      console.log('SUCCESS REDIRECT')
    }).catch((err) => {
      // todo error handling
    }).finally(() => {
      setIsLoading(false)
    })
  }

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

          <form onSubmit={handleSubmit}>
            <TextInput name="Email" size="md" placeholder="mustermann@example.com" label="E-Mail Adresse" type="email" mb="md" required />
            <TextInput name="Password" size="md" label="Passwort" type="password" mb="md" required />

            <Checkbox
              size="md"
              mb="lg"
              required
              name="DataProtection"
              label={<Text>Ich habe die <Link href="https://immoradar.xyz/datenschutz">Datenschutzbestimmungen</Link> gelesen und stimme ihnen zu.</Text>}
            />

            <Button size="lg" mb="xl" fullWidth type="submit" loading={isLoading}>Account Erstellen</Button>
          </form>

          <Flex gap="md" justify="space-between" mt="md">
            <Link href="/login">Einloggen</Link>
          </Flex>
        </LoginCard>
      </main>
    </>
  );
}
