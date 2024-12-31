import { useState } from 'react';
import { Flex, Text, Button, Title, Box } from '@mantine/core';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <Layout
      title="ImmoRadar Grundstücke Suchen"
      description="Entdecken Sie Grundstücke, die perfekt zu Ihren Wünschen passen. Geben Sie Ihre Anforderungen ein und wir helfen Ihnen, das ideale Grundstück zu finden."
    >
      <Box className={styles.header}>
        <div className={styles.background}></div>

        <Flex py="xl" mih="calc(100vh - 70px - 64px)" h="100%" direction="column" justify="space-evenly">
          <Box p={{ base: "sm", sm: "xl", md: "0" }}>
            <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 60 }} fw="bold" mb="lg" mt={{ base: 'xl', md: 0 }} textWrap="balance">
              ImmoRadar<br/><span className={styles.gradientText}>Grundstückbörse</span>
            </Title>
            <Text size="lg" mb="xl" ta={{ base: 'center', md: 'left' }}>
              Mit der Grundstückbörse bringen Grundstückssuchende und Verkäufer zusammen. Entdecke exklusive Grundstücke oder finde Käufter für dein Grundstück.
            </Text>
          </Box>

          <Flex justify="space-between" direction={{ base: 'column', sm: 'row'}} gap="md">
            <Button size="lg" href="/grundstuecke/suchen" component={Link}>Grundstücke entdecken</Button>
            <Button size="lg" href="/grundstuecke/anbieten" component={Link}>Grundstücke anbieten</Button>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
}
