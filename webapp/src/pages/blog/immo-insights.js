import React from 'react';
import { Container, Title, Text } from '@mantine/core';
import Layout from '@/components/Layout/Layout';

const AboutPage = () => {
  return (
    <Layout
      title="Immo Insights - Statistiken zu Wohnungsinseraten | ImmoRadar"
      description="todo"
    >
      <Container py="xl">
        <Title order={1}>Immo Insights - Statistiken zu Wohnungsinseraten</Title>
          
      </Container>
    </Layout>
  );
};

export default AboutPage;