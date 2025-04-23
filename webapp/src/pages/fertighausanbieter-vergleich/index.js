import { Flex, Button, Title, Box } from '@mantine/core';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
import Link from 'next/link';

export default function HausanbieterVergleich() {
  return (
    <Layout
      title="Hausanbieter Vergleich | Fertighaus Radar"
      description="todo"
    >
      <Box className={styles.header} py="xl">
        <div className={styles.background}></div>

        <Flex mih="calc(100vh - 70px - 64px)" h="100%" direction="column" justify="space-evenly">
          <Flex gap="xl" direction="column" justify="center" align={{ base: 'center', md: 'start' }}>
            <Box p={{ base: "sm", sm: "xl", md: "0" }}>
              <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 60 }} fw="bold" mb="lg" mt={{ base: 'xl', md: 0 }} textWrap="balance">
                Der <span className={styles.gradientText}>Fertighausanbieter Vergleich</span>.
              </Title>
              <Title order={2} fz={{ base: 24, xs: 32, sm: 40, md: 48 }} ta={{ base: 'center', md: 'left' }} mb="xl" fw={300}>
                Nutze unser Tool und spare dir die Stundenlange Recherche.
              </Title>
            </Box>

            <Button size="xl" component={Link} href="/fertighausanbieter-vergleich/start">Fertighausanbieter Vergleich Starten</Button>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
}
