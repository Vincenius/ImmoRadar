import { Flex, Text, Group, Button, Title, Box, TextInput, Stepper, Table, Modal, Chip, Select, Radio, Loader } from '@mantine/core';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
import Link from 'next/link';


export default function Foerderung() {
  return (
    <Layout
      title="Förderradar"
      description="todo"
      noindex={true} // todo
    >
      <Box className={styles.header} py="xl">
        <div className={styles.background}></div>

        <Flex mih="calc(100vh - 70px - 64px)" h="100%" direction="column" justify="space-evenly">
          <Flex gap="xl" direction="column" justify="center" align={{ base: 'center', md: 'start' }}>
            <Box p={{ base: "sm", sm: "xl", md: "0" }}>
              <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 60 }} fw="bold" mb="lg" mt={{ base: 'xl', md: 0 }} textWrap="balance">
                Der <span className={styles.gradientText}>Förder Check</span>.
              </Title>
              <Title order={2} fz={{ base: 24, xs: 32, sm: 40, md: 48 }} ta={{ base: 'center', md: 'left' }} mb="xl" fw={300}>
                Hausbau leichter finanzieren mit staatlichen Förderungen.
              </Title>
            </Box>

            <Button size="xl" component={Link} href="/foerdercheck">Fördercheck Starten</Button>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
}
