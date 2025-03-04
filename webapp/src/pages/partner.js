import React from 'react';
import { Container, Title, Text, Grid, Image, Card, Flex, Box, Button } from '@mantine/core';
import NextImage from 'next/image';
import Layout from '@/components/Layout/Layout';

const Partner = ({ image, name, description, link, linkText }) => {
  return (<Grid.Col span={12}>
    <Card shadow="sm" withBorder>
      <Flex gap="lg" direction={{ base: 'column', xs: 'row' }}>
        <Image
          component={NextImage}
          src={`/imgs/partner/${image}`}
          height={300}
          width={300}
          w={{ base: '100%', xs: 150 }}
          h={{ base: 'auto' }}
          alt={name}
        />

        <Flex direction="column" justify="space-between">
          <Box>
            <Title order={3} size="h4" mb="sm">{name}</Title>
            <Text fs="italic" mb="xs">{description}</Text>
          </Box>
          <Button component="a" size="sm" mt="md" variant="outline" href={link} target='_blank' rel="noopener noreferrer">
            {linkText}
          </Button>
        </Flex>
      </Flex>
    </Card>
  </Grid.Col>)
}

const PartnerPage = () => {
  return (
    <Layout
      title="Kooperationspartner | Fertighaus Radar"
    // TODO description="Willkommen bei Fertighaus Radar, Ihrer Webseite für die Wohnungssuche in Deutschland. Diese Webseite wurde von mir, Vincent, ins Leben gerufen. Mein Ziel ist es, die Wohnungssuche so einfach und stressfrei wie möglich zu gestalten..."
    >
      <Container py="xl" size="sm">
        <Title order={1} mb="lg">Kooperations<wbr/>partner</Title>
        <Text mb="xl">
          <b>Einfach Finden.</b> Unsere starken Partner an unserer Seite - für eine erfolgreiche und innovative Immobiliensuche.
        </Text>

        <Grid mb="3rem">
          <Partner
            name="tinyways"
            image="tinyways.png"
            link="https://www.tinyways.de/"
            linkText="tinyways.de"
            description="Eine Handvoll Expert:innen von ganz unterschiedlichen Disziplinen, welche seit Anfang 2020 die Idee von einer ökologischen tiny house-Gemeinschaft haben."
          />

          <Partner
            name="Andre Lamberti"
            image="swisslife-andre.jpg"
            link="https://swisslife-select.finlink.de/andre-lamberti/start/finance_type?partner=3c37fba5-673b-4fef-bfd9-95c11ae8aa68&partnerCompany=Oliver%20Rausch"
            linkText="Jetzt Anbieter und Konditionen vergleichen!"
            description="André Lamberti ist Experte für Immobilienfinanzierungen. Mit seiner 20 jährigen Erfahrung unterstützt er Menschen dabei die passende Finanzierung für die persönliche Traumimmobilie zu finden."
          />

          <Partner
            name="Baufinanzierung Horn & Rozanski"
            image="hr-baufinanzierung.png"
            link="https://finl.ink/ofnji"
            linkText="Jetzt Anbieter und Konditionen vergleichen!"
            description="Baufinanzierung Horn & Rozanski bietet transparente, maßgeschneiderte Baufinanzierungen und arbeitet mit über 600 Banken zusammen, um Kunden erfolgreich zur Traumimmobilie zu begleiten."
          />
        </Grid>

        <Title order={2} mb="sm">Werde Partner!</Title>
        <Text mb="md">
          Hast du Interesse an einer Zusammenarbeit? Kontaktiere uns und lass uns gemeinsam neue Wege in die Zukunft gehen.
        </Text>
        <Text mb="xl">
          <Button component="a" size="lg" href="mailto:oliver.rausch@fertighausradar.de">Jetzt Kontakt aufnehmen!</Button>
        </Text>
      </Container>
    </Layout>
  );
};

export default PartnerPage;