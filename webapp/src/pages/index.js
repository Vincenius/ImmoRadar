import { Flex, Text, Title, Box, Image, Button } from '@mantine/core';
import NextImage from 'next/image';
import Layout from '@/components/Layout/Layout'
import FAQs from '@/components/FAQ/FAQ';
import FeatureCards from '@/components/FeatureCards/FeatureCards';
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <Layout
      title="ImmoRadar | Alle Immobilienangebote an einem Ort"
      description="Kein mühsames Durchsuchen mehrerer Webseiten. Eine gut sortierte Liste ohne Duplikate und sofortige Updates bei neuen Angeboten."
    >
      <Box className={styles.header}>
        <div className={styles.background}></div>

        <Flex direction="column" justify="space-evenly">
          <Box mb="xl">
            <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 72 }} fw="bold" mb="lg" textWrap="balance">
              Ihr Partner für den <span className={styles.gradientText}>Weg ins Eigenheim</span>
            </Title>
            <Text size="xl">
              Ob Sie nach einem passenden Grundstück suchen, Fertighausanbieter vergleichen oder Ihr Budget für den Traum vom Eigenheim kalkulieren möchten – ImmoRadar bietet Ihnen die Lösungen, die Sie brauchen, um Ihr Projekt voranzubringen.
            </Text>
          </Box>
          
          <FeatureCards />
        </Flex>
      </Box>
      <Box component="section" py="8rem">
        {/*  todo section - image left, text right, link button */}
        <Flex>
          <Image
            radius="md"
            component={NextImage}
            src="/imgs/calculator.jpg"
            alt="Schreibtisch mit Taschenrechner"
            height={300}
            width={300}
            w={300}
          />
          <Box ml="xl">
            <Title order={2} size="h1" mb="lg">
              Förderungscheck
            </Title>
            <Text mb="md">
              Finden Sie heraus, welche staatlichen Förderungen und Zuschüsse Ihnen für den Hausbau oder -kauf zur Verfahrung stehen.
            </Text>
            <Button>Förderungen finden</Button>
          </Box>
        </Flex>
      </Box>
      <FAQs />
    </Layout>
  );
}
