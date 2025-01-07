import React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Flex, Text, Card, Image, rem } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import feature1 from './calculator.jpg';
import feature2 from './house.jpg';
import feature3 from './property.jpg';

const FeatureCard = ({ image, title, text, alt, link, linkText }) => <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
  <Card.Section>
    <Image
      component={NextImage}
      src={image}
      height={160}
      alt={alt || title}
    />
  </Card.Section>

  <Text fw={500} mt="md" mb="sm">{title}</Text>

  <Text size="sm" c="gray.7" mb="md">{text}</Text>

  <Text c="gray.6">
    { link && <Link href={link} style={{ display: 'flex', alignItems: 'center', gap: rem(4) }}>
      {linkText} <IconArrowRight style={{ width: rem(16), height: rem(16) }}/>
    </Link> }
    { !link && "Demnächst verfügbar" }
  </Text>
</Card>

const FeatureCards = () => {
    return (
        <Flex my="xl" gap="xl" direction={{ base: "column", sm: "row" }}>
            <FeatureCard
              image={feature3}
              title="Grundstückssuche"
              text="Entdecken Sie passende Grundstücke für Ihr Bauprojekt. Unsere Suche kombiniert die Ergebnisse von verschiedenen Immobilienportalen."
              alt="Grundstück von oben"
              link="/grundstuecke/suche"
              linkText="Grundstücke entdecken"
            /> 
            <FeatureCard
              image={feature1}
              title="Förderungscheck"
              text="Finden Sie heraus, welche staatlichen Förderungen und Zuschüsse Ihnen für den Hausbau oder -kauf zur Verfügung stehen."
              alt="Taschenrechner und Geld auf einem Tisch"
              // link="/foerderung"
              // linkText="Förderungen finden"
            />
            <FeatureCard
              image={feature2}
              title="Fertighaus-Anbieter Vergleich"
              text="Vergleichen Sie Fertighausanbieter schnell und einfach mit unserem Assistenten und entdecken Sie maßgeschneiderte Angebote."
              alt="Fertighaus von vorne"
              // link="/vergleich"
              // linkText="Anbieter vergleichen"
            />
             
        </Flex>
    );
};

export default FeatureCards;
