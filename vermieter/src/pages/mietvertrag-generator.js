import Layout from '@/components/Layout/Layout'
import { Title } from '@mantine/core'
import 'dayjs/locale/de';
import ContractWizard from '@/components/ContractWizard/ContractWizard'

function Mietvertraege() {
  return (
    <Layout title="Mietvertrag Generator" noindex={true}>
      <Title mb="xl" fw="lighter" size="3em">Mietvertrag Generator</Title>

      <ContractWizard isAuthenticated={process.env.NEXT_PUBLIC_DISABLE_STRIPE === 'true'} />
    </Layout >
  )
}

export default Mietvertraege
