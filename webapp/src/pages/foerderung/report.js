import Layout from '@/components/Layout/Layout'
import { Title, Container } from '@mantine/core';
import SubsidyReport from '@/components/SubsidyReport/SubsidyReport';

export async function getServerSideProps({ req, res, resolvedUrl }) {
  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');
  const baseUrl = process.env.BASE_URL

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
