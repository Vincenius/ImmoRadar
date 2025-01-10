import { useState } from 'react';
import { Flex, Text, Button, Title, Box, Image } from '@mantine/core';
import NextImage from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <Layout
      title="ImmoRadar Grundstückbörse"
      description="Entdecken Sie Grundstücke, die perfekt zu Ihren Wünschen passen. Geben Sie Ihre Anforderungen ein und wir helfen Ihnen, das ideale Grundstück zu finden."
    >
      <Flex py="6rem" direction="column" justify="center" mih="calc(100vh - 64px - 52px - 16px)">
        <div className={styles.background}></div>

        <Flex align="center" gap="xl" direction={{ base: "column-reverse", md: "row" }}>
          <Box p={{ base: "sm", sm: "xl", md: "0" }}>
            <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, md: 60 }} fw="bold" mb="lg" textWrap="balance">
              ImmoRadar<br/><span className={styles.gradientText}>Grundstückbörse</span>
            </Title>
            <Text size="lg" mb="xl" ta={{ base: 'center', md: 'left' }}>
              Mit der Grundstückbörse bringen Grundstückssuchende und Verkäufer zusammen. Entdecke exklusive Grundstücke oder finde Käufter für dein Grundstück.
            </Text>

            <Flex direction={{ base: 'column', sm: 'row'}} gap="xl" justify={{ base: 'center', md: 'flex-start' }}>
              <Button size="lg" href="/grundstueckboerse/suchen" component={Link}>Grundstücke entdecken</Button>
              <Button size="lg" href="/grundstueckboerse/anbieten" component={Link}>Grundstücke anbieten</Button>
            </Flex>
          </Box>

          <Image
            radius="md"
            component={NextImage}
            src="/imgs/property.jpg"
            alt="Leeres Grundstück von oben"
            height={300}
            width={300}
            w={300}
          />
        </Flex>
      </Flex>
    </Layout>
  );
}
