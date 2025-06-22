import React, { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { Title, Card, Button } from '@mantine/core';
import Checkout from '@/components/Checkout/Checkout';
import Pricing from '@/components/Pricing/Pricing';
import { IconCircleCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import headers from '@/utils/fetchHeader';

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
      'x-api-key': process.env.API_KEY,
      ...headers
    }
  }).then(res => res.json())

  if (data?.user?.Variant === 'premium_plus') {
    return {
      redirect: {
        destination: '/report?id=' + id,
        permanent: false,
      },
    };
  }

  return {
    props: { id, email: data?.user?.Email, name: data?.user?.Name, plan: data?.user?.Variant, defaultPlan: plan },
  };
}

const upgradeMap = {
  starter: 'premium_plus_upgrade_starter',
  premium: 'premium_plus_upgrade_premium'
}

function ReportCheckout({ id, email, name, plan, defaultPlan }) {
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
        CtaStarter={<Button variant="outline" onClick={() => setVariant('starter')} disabled={plan === 'starter' || plan === 'premium'} fullWidth>
          {plan === 'starter' ? <><IconCircleCheck size={16} />&nbsp;Du hast diese Variante bereits</> : 'Jetzt Kaufen'}
        </Button>}
        CtaPremium={<Button onClick={() => setVariant(plan === 'starter' ? 'premium_upgrade' : 'premium')} disabled={plan === 'premium'} fullWidth>
          {plan === 'starter' ? 'Jetzt Upgraden' : 'Jetzt Kaufen'}
        </Button>}
        CtaPremiumPlus={<Button variant="outline" onClick={() => setVariant(upgradeMap[plan] || 'premium_plus')} fullWidth disabled={plan !== 'premium'}>
          {plan === 'premium' ? 'Jetzt Upgraden' : 'Mit Premium Verfügbar'}
        </Button>}
      />}
      {variant && <Card bg="white" px="md" py="xl" radius="md" withBorder mb="xl" shadow="md">
        <Checkout email={email} name={name} id={id} variant={variant} />
        <Button variant="outline" onClick={() => goBack()} w="150px">Zurück</Button>
      </Card>}
    </Layout>
  )
}

export default ReportCheckout
