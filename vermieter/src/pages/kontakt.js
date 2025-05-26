import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Text, Title, Container } from '@mantine/core';

const Imprint = () => {
  return (
    <Layout
      title="Kontakt"
    >
      <Container size="sm">
        <Title order={1} my="xl">Kontakt</Title>

        <Text mb="md">Solltest du Fragen, Anregungen oder Probleme haben, zögere nicht, uns zu kontaktieren. Unser Team steht dir gerne zur Verfügung:</Text>

        <Text mb="md"><a href="mailto:support@vertragsfabrik.com">support@vertragsfabrik.com</a></Text>
        
        <Text>Wir bemühen uns, innerhalb von 24 Stunden zu antworten.</Text>
      </Container>
    </Layout>
  );
};

export default Imprint;