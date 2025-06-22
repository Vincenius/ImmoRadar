import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import {
  Card,
  TextInput,
  Button,
  Notification,
  Stack,
  Title,
  Text,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

export async function getServerSideProps({ req, res, resolvedUrl }) {
  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');

  if (!id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { id },
  };
}

const Appointment = ({ id }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    setError(false);

    try {
      const res = await fetch('/api/book-appointment', {
        method: 'POST',
        body: JSON.stringify({ phone, id }),
      });

      if (res.ok) {
        setSuccess(true);
        setPhone('');
      } else {
        throw new Error();
      }
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Termin vereinbaren"
      noindex="true"
      withBackground={true}
    >
      <Card p={{ base: 'sm', xs: 'xl' }} my="xl" maw={500} mx="auto">
        <Stack>
          <Title order={2}>Termin vereinbaren</Title>
          <Text>
            Gib deine Telefonnummer ein und wir melden uns zeitnah bei dir, um
            einen passenden Gesprächstermin zu vereinbaren – natürlich
            kostenlos und unverbindlich.
          </Text>

          <TextInput
            label="Deine Telefonnummer"
            placeholder="z. B. 0151 23456789"
            value={phone}
            onChange={(event) => setPhone(event.currentTarget.value)}
            required
          />

          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={!phone}
          >
            Termin anfragen
          </Button>

          {success && (
            <Text mt="md" c="green.9">
              Termin erfolgreich angefragt! Wir melden uns bald bei dir.
            </Text>
          )}

          {error && (
            <Text mt="md" c="red.9">
              Etwas ist schiefgelaufen. Bitte versuche es erneut.
            </Text>
          )}
        </Stack>
      </Card>
    </Layout>
  );
};

export default Appointment;
