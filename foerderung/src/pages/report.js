import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { Title, Container, Button, Group, Text } from '@mantine/core';
import { IconDownload, IconListCheck, IconShoppingCart } from '@tabler/icons-react';
import Link from 'next/link';

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
      'x-api-key': process.env.API_KEY
    }
  }).then(res => res.json())

  return {
    props: { data, baseUrl, id },
  };
}


export default function Report({ data, baseUrl, id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // const { paid_success, confirmed, ...otherQuery } = router.query;
  const { user } = data
  const answeredQuestions = user.Answers && Object.keys(user.Answers).length > 0

  const downloadPdf = () => {
    setLoading(true)
    fetch(`/api/pdf?id=${id}`, {
      method: 'GET',
    }).then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }).catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  return (
    <Layout
      title="Dein Förderreport"
      noindex={true}
    >
      {user.Variant === 'free' && <Container size="sm" pb="lg">
        <Title order={1} mb="xl">Vielen Dank für deine Bestätigung!</Title>

        <Text mb="xl" size="md">
          Deine E-Mail-Adresse wurde erfolgreich bestätigt. Du kannst jetzt deinen kostenlosen Förderreport als PDF herunterladen.
        </Text>

        <Group spacing="md" mb="xl">
          <Button
            leftSection={<IconDownload size={18} />}
            variant="filled"
            size="md"
            onClick={downloadPdf}
            loading={loading}
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

        {loading && <Text mb="md" size="sm">Bitte hab einen Moment Geduld<br />Die PDF wird gerade für dich generiert. Das kann ein paar Sekunden dauern.</Text>}
        {error && <Text size="md" c="red.9">PDF konnte nicht heruntergeladen werden. Bitte versuche es erneut. Falls der Fehler weiterhin besteht, kontaktiere uns per E-Mail.</Text>}
      </Container>}

      {user.Variant !== 'free' && !answeredQuestions && <Container size="sm" pb="lg">
        <Title order={1} mb="xl">Vielen Dank für deinen Kauf!</Title>

        <Text mb="xl" size="md">
          Deine Förderreport <b>{variantTextMap[user.Variant]} Variante</b> ist jetzt freigeschaltet.
          Du kannst nun den QuickCheck starten und ein paar Fragen beantworten, damit wir passende Fördermittel für dich finden oder deinen Förderreport als PDF herunterladen.
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
          >
            PDF herunterladen
          </Button>
        </Group>

        {loading && <Text mb="md" size="sm">Bitte hab einen Moment Geduld<br />Die PDF wird gerade für dich generiert. Das kann ein paar Sekunden dauern.</Text>}
        {error && <Text size="md" c="red.9">PDF konnte nicht heruntergeladen werden. Bitte versuche es erneut. Falls der Fehler weiterhin besteht, kontaktiere uns per E-Mail.</Text>}
      </Container>}

      {user.Variant !== 'free' && answeredQuestions && <Container size="sm" pb="lg">
        <Title order={1} mb="xl">Dein persönlicher Fördercheck ist fertig!</Title>

        <Text mb="xl" size="md">
          Basierend auf deinen Angaben haben wir eine individuelle Auswertung für dich erstellt.
          Du kannst jetzt deine angepasste PDF mit allen relevanten Förderungen herunterladen oder den QuickCheck erneut starten, falls du etwas ändern oder ein neues Szenario durchspielen möchtest.
        </Text>

        <Group spacing="md" mb="md">
          <Button
            leftSection={<IconDownload size={18} />}
            variant="filled"
            size="md"
            onClick={downloadPdf}
            loading={loading}
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

        {loading && <Text mb="md" size="sm">Bitte hab einen Moment Geduld<br />Die PDF wird gerade für dich generiert. Das kann ein paar Sekunden dauern.</Text>}
        {error && <Text size="md" c="red.9">PDF konnte nicht heruntergeladen werden. Bitte versuche es erneut. Falls der Fehler weiterhin besteht, kontaktiere uns per E-Mail.</Text>}
      </Container>}
    </Layout>
  );
}
