import Layout from '@/components/Layout/Layout'
import { Title } from '@mantine/core'
import 'dayjs/locale/de';
import useAuthRedirect from "@/utils/useAuthRedirect";
import ContractWizard from '@/components/ContractWizard/ContractWizard'

function Mietvertraege() {
  useAuthRedirect('/mietvertrag-generator')

  return (
    <Layout title="Mietvertrag Generator" noindex={true}>
      <Title mb="xl" fw="lighter" size="3em">Mietvertrag Generator</Title>

      <ContractWizard />
    </Layout >
  )
}

export default Mietvertraege
