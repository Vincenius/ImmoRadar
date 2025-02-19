import React from 'react'
import Layout from '@/components/Layout/Layout'
import { Title, Container } from '@mantine/core';

function ReportCheckout() {
  return (
    <Layout
      title="ImmoRadar Checkout"
      description="todo."
      noindex={true}
    >
      <Title order={1} my="xl">Checkout</Title>

      Hier kommt der Checkout hin
    </Layout>
  )
}

export default ReportCheckout
