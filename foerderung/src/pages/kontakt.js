import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Text, Title, Box, Image, Flex } from '@mantine/core';
import NextImage from 'next/image';

const Contact = () => {
  return (
    <Layout
      title="Kontakt"
      noindex="true"
      withBackground={true}
    >
      <Flex gap={{ base: "md", sm: "xl" }} direction={{ base: 'column', sm: 'row' }} py="3em">
        <Image
          component={NextImage}
          src="/imgs/contact.jpg"
          alt="Eine Person die auf ein Handy schaut aus dem E-Mail Icons hervorkommen."
          height={250}
          width={600}
          w={{ base: '280px', sm: 'auto' }}
          h={{ base: '100px', sm: '250px' }}
          radius="md"
        />
        <Box>
          <Title order={1} mb="xl" mt="0">Kontakt</Title>
          <Text mb="md">Solltest du Fragen, Anregungen oder Probleme haben, zögere nicht, uns zu kontaktieren. Unser Team steht dir gerne zur Verfügung:</Text>

          <Text><a href="mailto:support@foerderhaus24.de">support@foerderhaus24.de</a></Text>
          <Text mb="md"><a href="tel:+4915563286282">+49 155 63286282</a></Text>

          <Text>Wir bemühen uns, innerhalb von 24 Stunden zu antworten.</Text>
        </Box>
      </Flex>
    </Layout>
  );
};

export default Contact;