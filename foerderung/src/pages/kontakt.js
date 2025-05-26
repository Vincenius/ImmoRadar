import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Text, Title, Container } from '@mantine/core';

const Contact = () => {
  return (
    <Layout
      title="Kontakt"
      noindex="true"
    >
      <Container size="sm">
        <Title order={1} my="xl">Kontakt</Title>

        <Text mb="md">Solltest du Fragen, Anregungen oder Probleme haben, zögere nicht, uns zu kontaktieren. Unser Team steht dir gerne zur Verfügung:</Text>

        <Text mb="md"><a href="mailto:support@foerderhaus24.de">support@foerderhaus24.de</a></Text>
        
        <Text>Wir bemühen uns, innerhalb von 24 Stunden zu antworten.</Text>
      </Container>
    </Layout>
  );
};

export default Contact;