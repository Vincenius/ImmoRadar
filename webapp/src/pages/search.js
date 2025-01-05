
import { Text, Title, Container } from '@mantine/core';
import Layout from '@/components/Layout/Layout'


export default function Search() {
  return (
    <Layout
      title="Die Immobiliensuche wurde eingestellt | ImmoRadar"
      description=""
      noindex={true}
    >
      <Container py="xl" size="sm">
        <Title order={1} my="xl">Die Immobiliensuche wurde eingestellt</Title>
        <Text mb="md">
          Vielen Dank für dein Interesse an ImmoRadar. Aufgrund aktueller Entwicklungen haben wir uns entschieden, die Immobiliensuche einzustellen.
          Wir arbeiten daran, unsere Dienste und Angebote zu optimieren, um in Zukunft wieder auf deine Bedürfnisse eingehen zu können.
        </Text>
        <Text mb="md">
          Solltest du Fragen haben oder Unterstützung benötigen, zögere nicht, uns zu kontaktieren.
          Wir schätzen dein Verständnis und freuen uns darauf, dir bald wieder helfen zu können.
        </Text>
        <Text>
          Vielen Dank für dein Vertrauen!<br/>
          Dein ImmoRadar-Team
        </Text>
      </Container>
    </Layout>
  );
}
