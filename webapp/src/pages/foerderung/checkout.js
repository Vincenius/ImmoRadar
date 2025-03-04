import React from 'react'
import Layout from '@/components/Layout/Layout'
import { Title, Card } from '@mantine/core';
import Checkout from '@/components/Checkout/Checkout';

export async function getServerSideProps({ resolvedUrl }) {
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
    props: { id, email: data?.user?.Email },
  };
}

function ReportCheckout({ id, email }) {
  // todo check if user already paid
  // todo test & check error path

  return (
    <Layout
      title="Checkout | Fertighaus Radar"
      description="todo."
      noindex={true}
    >
      <Title order={1} mt="xl" mb="lg">Checkout</Title>
      <Card bg="white" px="md" py="xl" radius="md" withBorder mb="xl">
        <Checkout email={email} id={id} />
      </Card>
    </Layout>
  )
}

export default ReportCheckout
