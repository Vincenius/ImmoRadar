import React, { useEffect } from 'react'
import Layout from '@/components/Layout/Layout'
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';
import EstateCards from '@/components/EstateCards/EstateCards';
import { Title } from '@mantine/core';

function Immobilien() {
  const router = useRouter()

  useEffect(() => {
    const { success } = router.query
    if (success === 'new' || success === 'edit') {
      const { pathname, query } = router;
      notifications.show({
        title: success === 'new' ? 'Immobilie erstellt' : 'Immobilie aktualisiert',
        message: success === 'new' ? 'Deine Immobilie wurde erfolgreich angelegt.' : 'Deine Immobilie wurde erfolgreich angepasst.',
        color: 'green',
        position: 'top-center',
      });
      // Remove the confirm query param from the URL
      const params = new URLSearchParams(query);
      params.delete('success');
      router.replace(
        { pathname, query: params.toString() },
        undefined,
        { shallow: true }
      );
    }
  }, [router.query]);

  return (
    <Layout title="Deine Immobilien">
      <Title order={1} size="h3" weight={500} mb="xl">Deine Immobilien</Title>
      <EstateCards />
    </Layout>
  )
}

export default Immobilien
