import Layout from '@/components/Layout/Layout'
import { Title, Text } from '@mantine/core';

export default function Home() {
  return (
    <Layout
      title="ImmoRadar Checkout"
      description="todo."
      noindex={true}
    >
      <Title order={1} my="xl">Deine Förderung</Title>
      <Text mb="md">Hier kommt dann eine detailierte Ansicht der Förderungen</Text>
      <Text mb="md">Der Link zu diesem Ergebnis kommt dann auch per E-Mail</Text>
      <Text mb="md">Links zur Beantragung</Text>
      <Text mb="md">Eventuell ein Erklärvideo</Text>
      <Text mb="md">Kontakt für Fragen</Text>
    </Layout>
  );
}
