import React from 'react';
import NextImage from 'next/image';
import { Flex, Text, Card, Image } from '@mantine/core';
import feature1 from './feature1.webp';
import feature2 from './feature2.webp';
import feature3 from './feature3.webp';

const FeatureCard = ({ image, title, text }) => <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
  <Card.Section>
    <Image
      component={NextImage}
      src={image}
      height={160}
      alt={title}
    />
  </Card.Section>

  <Text fw={500} mt="md" mb="sm">{title}</Text>

  <Text size="sm" c="dimmed">{text}</Text>
</Card>

const FeatureCards = () => {
    return (
        <Flex gap="xl" direction={{ base: "column", sm: "row" }}>
            <FeatureCard image={feature1} title="Alle Angebote an einem Ort" text="ImmoRadar durchsucht alle relevanten Immobilien-Webseiten und fasst die Ergebnisse zusammen. So sparen Sie Zeit und Mühe." />
            <FeatureCard image={feature2} title="Keine Duplikate" text="Wir filtern doppelte Einträge heraus, sodass Sie eine klare und übersichtliche Liste der verfügbaren Wohnungen erhalten." />
            <FeatureCard image={feature3} title="Benachrichtigungen" text="Erhalten Sie Benachrichtigungen, sobald eine neue Wohnung, die Ihren Suchkriterien entspricht, verfügbar wird. Verpassen Sie nie wieder eine passende Wohnung." />
        </Flex>
    );
};

export default FeatureCards;
