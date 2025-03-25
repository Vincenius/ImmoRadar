import Layout from '@/components/Layout/AppLayout'
import { Title } from '@mantine/core'
import EstateForm from '@/components/EstateForm/EstateForm'

function Immobilie() {
  return (
    <Layout title="Neue Immobilie">
      <Title order={1} size="h3" weight={500} mb="xl">Neue Immobilie anlegen</Title>

      <EstateForm />
    </Layout>
  )
}

export default Immobilie
