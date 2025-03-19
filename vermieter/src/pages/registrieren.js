import { useState } from 'react'
import Head from "next/head";
import Link from "next/link";
import { Flex, Title, TextInput, Button, Text } from '@mantine/core';
import Checkbox from '@/components/Inputs/Checkbox';
import LoginCard from "@/components/LoginCard/LoginCard";
import Layout from '@/components/Layout/Layout';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState();
  const [unexpectedError, setUnexpectedError] = useState();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    setEmailError(null)
    setUnexpectedError(null)

    const formObject = {};
    const elements = e.target.elements;
    for (let element of elements) {
      if (element.name && element.value) {
        formObject[element.name] = element.value;
      }
    }
    fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(formObject),
    }).then(res => {
      if (res.status === 400) {
        setEmailError('E-Mail Adresse ist bereits vergeben')
      } else {
        setIsSuccess(true)
      }
    }).catch((err) => {
      setUnexpectedError('Ein unerwarteter Fehler ist aufgetreten')
      console.error(err)
    }).finally(() => {
      setIsLoading(false)
    })
  }

  return (
    <Layout title={`Registrieren | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}>
      <LoginCard>
        <Title ta="center" fw="lighter" mb="xl">Registrieren</Title>

        {!isSuccess && <>
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
            {unexpectedError && <Text c="red.9" mb="lg">{unexpectedError}</Text>}
          </form>

          <Flex gap="md" justify="space-between" mt="md">
            <Link href="/login">Einloggen</Link>
          </Flex>
        </>}

        {isSuccess && <Flex direction="column" gap="md" align="center">
          <Text fw="bold">Dein Account wurde erfolgreich erstellt</Text>
          <Text>Bitte prüfe dein E-Mail Konto und bestätige die Registrierung.</Text>
        </Flex>}
      </LoginCard>
    </Layout>
  );
}
