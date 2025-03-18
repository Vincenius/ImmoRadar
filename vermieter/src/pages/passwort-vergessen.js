import Head from "next/head";
import Link from "next/link";
import { Flex, Title, TextInput, Button } from '@mantine/core';
import LoginCard from "@/components/LoginCard/LoginCard";
import Layout from '@/components/Layout/Layout';

export default function Home() {
  return (
    <Layout title={`Passwort vergessen | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}>
      <LoginCard>
        <Title ta="center" fw="lighter" mb="xl">Passwort vergessen</Title>

        <TextInput size="md" placeholder="mustermann@example.com" label="E-Mail Adresse" type="email" mb="md" />

        <Button size="lg" mb="xl" fullWidth>Passwort zurücksetzten</Button>

        <Flex gap="md" justify="space-between" mt="md">
          <Link href="/registrieren">Registrieren</Link>
          <Link href="/login">Einloggen</Link>
        </Flex>
      </LoginCard>
    </Layout>
  );
}
