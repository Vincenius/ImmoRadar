import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { showNotification } from '@mantine/notifications';
import Layout from '@/components/Layout/Layout'
import { Title, Container } from '@mantine/core';
import SubsidyReport from '@/components/SubsidyReport/SubsidyReport';

export async function getServerSideProps({ req, res, resolvedUrl }) {
  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');
  const baseUrl = process.env.BASE_URL

  if (!id) {
    return {
      redirect: {
        destination: '/foerderung',
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
    props: { data, baseUrl },
  };
}


export default function Report({ data, baseUrl }) {
  const router = useRouter();
  const { is_new, paid_success, ...otherQuery } = router.query;

  useEffect(() => {
    if (is_new || paid_success) {
      // Show notification based on the notify parameter
      showNotification({
        title: is_new === 'true'
          ? 'Report erfolgreich erstellt!'
          : paid_success === 'true' ? 'Vollständiger Report freigeschaltet' : 'Fehler beim Bezahlvorgang',
        message: is_new === 'true'
          ? 'Dein Report wurde erstellt und dir als PDF per E-Mail zugesand.'
          : paid_success === 'true' ? 'Dein vollständiger Report wurde erfolgreich freigeschaltet.' : 'Dein Report konnte nicht freigeschaltet werden. Bitte versuche es erneut oder kontaktiere unseren Support.',
        color: is_new === 'true' || paid_success === 'true' ? 'green' : 'red',
      });

      // Remove the "notify" query parameter from the URL without refreshing the page
      const newQuery = { ...otherQuery }; // all other query parameters
      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [is_new, paid_success, otherQuery, router]);

  return (
    <Layout
      title="ImmoRadar Förderungen Report"
      description="todo."
      noindex={true}
    >
      <Container size="sm">
        <Title order={1} my="xl">Dein Förderungen Report</Title>
        
        <SubsidyReport data={data} baseUrl={baseUrl} />
      </Container>
    </Layout>
  );
}
