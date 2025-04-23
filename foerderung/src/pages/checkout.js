import React, { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { Title, Card, Button } from '@mantine/core';
import Checkout from '@/components/Checkout/Checkout';
import Pricing from '@/components/Pricing/Pricing';
import { IconCircleCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';

export async function getServerSideProps({ resolvedUrl }) {
  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');
  const plan = params.get('plan');
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

  if (data?.user?.Variant === 'professional') {
    return {
      redirect: {
        destination: '/report?id=' + id,
        permanent: false,
      },
    };
  }

  return {
    props: { id, email: data?.user?.Email, plan: data?.user?.Variant, defaultPlan: plan },
  };
}

function ReportCheckout({ id, email, plan, defaultPlan }) {
  const router = useRouter()
  const [variant, setVariant] = useState(defaultPlan)
  const goBack = () => {
    if (!defaultPlan) {
      setVariant(null)
    } else {
      router.push(`/foerdercheck?id=${id}`)
    }
  }

  return (
    <Layout title="Checkout" noindex={true}>
      <Title order={1} mt="xl" mb="lg">Checkout</Title>
      {!variant && <Pricing
        plan={plan}
        CtaPremium={<Button mt="lg" variant="outline" onClick={() => setVariant('premium')} disabled={plan === 'premium'}>
          {plan === 'premium' ? <><IconCircleCheck size={16} />&nbsp;Du hast bereits Premium</> : 'Jetzt Kaufen'}
        </Button>}
        CtaProfessional={<Button mt="lg" onClick={() => setVariant('professional')} disabled={plan === 'professional'}>
          {plan === 'premium' ? 'Jetzt Upgraden' : 'Jetzt Kaufen'}
        </Button>}
      />}
      {variant && <Card bg="white" px="md" py="xl" radius="md" withBorder mb="xl" shadow="md">
        <Checkout email={email} id={id} variant={variant} />
        <Button mt="lg" variant="outline" onClick={() => goBack()} w="150px">Zurück</Button>
      </Card>}
    </Layout>
  )
}

export default ReportCheckout
