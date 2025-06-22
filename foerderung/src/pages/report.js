import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { Title, Container, Button, Group, Text, Card } from '@mantine/core';
import { IconDownload, IconListCheck, IconShoppingCart } from '@tabler/icons-react';
import Link from 'next/link';
import headers from '@/utils/fetchHeader';

const variantTextMap = {
  'free': 'Kostenfreie',
  'starter': 'Starter',
  'premium': 'Premium',
  'premium_plus': 'Premium',
}

export async function getServerSideProps({ req, res, resolvedUrl }) {
  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');
  const baseUrl = process.env.BASE_URL

  if (!id) {
    return {
      redirect: {
        destination: '/foerdercheck',
        permanent: false,
      },
    };
  }

  const data = await fetch(`${baseUrl}/api/subsidies?id=${id}`, {
    method: 'GET',
    headers: {
      'x-api-key': process.env.API_KEY,
      ...headers
    }
  }).then(res => res.json())

  return {
    props: { data, baseUrl, id },
  };
}


export default function Report({ data, baseUrl, id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  // const { paid_success, confirmed, ...otherQuery } = router.query;
  const { user } = data
  const answeredQuestions = user.Answers && Object.keys(user.Answers).length > 0

  const downloadPdf = () => {
    setLoading(true)
    fetch(`/api/pdf?id=${id}`, {
      method: 'GET',
    }).then(() => {
      setSuccess(true)
    }).catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  return (
    <Layout
      title="Dein Förderreport"
      noindex={true}
      withBackground={true}
    >
      <Container size="sm" pb="lg" px="0">
        {user.Variant === 'free' && <Card p={{ base: 'sm', xs: 'xl' }} my="xl">
          <Title order={1} mb="xl">Vielen Dank für Deine Bestätigung!</Title>

          <Text mb="xl" size="md">
            Deine E-Mail-Adresse wurde erfolgreich bestätigt. Du kannst jetzt Deinen kostenlosen Förderreport als PDF herunterladen.
          </Text>

          <Group spacing="md" mb="xl">
            <Button
              leftSection={<IconDownload size={18} />}
              variant="filled"
              size="md"
              onClick={downloadPdf}
              loading={loading}
              disabled={success}
            >
              PDF herunterladen
            </Button>

            <Button
              component={Link}
              href={`/checkout?id=${id}`}
              leftSection={<IconShoppingCart size={18} />}
              variant="outline"
              size="md"
              disabled={loading}
            >
              Vollständigen Report kaufen
            </Button>
          </Group>

          {success && <Text mb="md" size="sm" c="green.9">
            <b>Deine PDF wird erstellt.</b><br />
            Der Versand per E-Mail wurde erfolgreich gestartet. Du erhältst das Dokument in Kürze in Deinem Posteingang.
          </Text>}
          {error && <Text size="md" c="red.9">PDF konnte nicht heruntergeladen werden. Bitte versuche es erneut. Falls der Fehler weiterhin besteht, kontaktiere uns per E-Mail.</Text>}
        </Card>}

        {user.Variant !== 'free' && !answeredQuestions && <Card p={{ base: 'sm', xs: 'xl' }} my="xl">
          <Title order={1} mb="xl">Vielen Dank für Deinen Kauf!</Title>

          <Text mb="xl" size="md">
            Deine Förderreport <b>{variantTextMap[user.Variant]} Variante</b> ist jetzt freigeschaltet.
            Du kannst nun den QuickCheck starten und ein paar Fragen beantworten, damit wir passende Fördermittel für dich finden oder Deinen Förderreport als PDF herunterladen.
          </Text>

          <Group spacing="md" mb="md">
            <Button
              component={Link}
              href={`/quickcheck?id=${id}`}
              leftSection={<IconListCheck size={18} />}
              variant="filled"
              size="md"
            >
              QuickCheck starten
            </Button>

            <Button
              leftSection={<IconDownload size={18} />}
              variant="outline"
              size="md"
              onClick={downloadPdf}
              loading={loading}
              disabled={success}
            >
              PDF herunterladen
            </Button>
          </Group>

          {success && <Text mb="md" size="sm" c="green.9">
            <b>Deine PDF wird erstellt.</b><br />
            Der Versand per E-Mail wurde erfolgreich gestartet. Du erhältst das Dokument in Kürze in Deinem Posteingang.
          </Text>}
          {error && <Text size="md" c="red.9">PDF konnte nicht heruntergeladen werden. Bitte versuche es erneut. Falls der Fehler weiterhin besteht, kontaktiere uns per E-Mail.</Text>}

          {user.Variant === 'premium' && <Text mb="xl" size="md">
            <b>Du willst noch mehr?</b><br />
            Im Premium Plus-Paket ist zusätzlich ein kostenloses Erstgespräch enthalten:
            Lerne uns kennen – ganz unverbindlich – und entscheide danach, ob dir die Zusammenarbeit das Geld wert ist.<br /><br />
            👉 <a href={`${baseUrl}/premium-plus-termin?id=${id}`} target="_blank">Jetzt kostenloses Erstgespräch im Premium Plus buchen</a>
          </Text>}
        </Card>}

        {user.Variant !== 'free' && answeredQuestions && <Card p={{ base: 'sm', xs: 'xl' }} my="xl">
          <Title order={1} mb="xl">Dein persönlicher Förderreport ist fertig!</Title>

          <Text mb="xl" size="md">
            Basierend auf Deinen Angaben haben wir eine individuelle Auswertung für dich erstellt.
            Du kannst jetzt Deine angepasste PDF mit allen relevanten Förderungen herunterladen oder den QuickCheck erneut starten, falls Du etwas ändern oder ein neues Szenario durchspielen möchtest.
          </Text>

          <Group spacing="md" mb="md">
            <Button
              leftSection={<IconDownload size={18} />}
              variant="filled"
              size="md"
              onClick={downloadPdf}
              loading={loading}
              disabled={success}
            >
              PDF herunterladen
            </Button>

            <Button
              component={Link}
              href={`/quickcheck?id=${id}`}
              leftSection={<IconListCheck size={18} />}
              variant="outline"
              size="md"
            >
              QuickCheck erneut starten
            </Button>
          </Group>

          {success && <Text mb="md" size="sm" c="green.9">
            <b>Deine PDF wird erstellt.</b><br />
            Der Versand per E-Mail wurde erfolgreich gestartet. Du erhältst das Dokument in Kürze in Deinem Posteingang.
          </Text>}
          {error && <Text size="md" c="red.9">PDF konnte nicht heruntergeladen werden. Bitte versuche es erneut. Falls der Fehler weiterhin besteht, kontaktiere uns per E-Mail.</Text>}
        </Card>}
      </Container>
    </Layout>
  );
}
