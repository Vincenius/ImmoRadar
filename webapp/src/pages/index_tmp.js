import { Flex, Text, Title, Box, Image, Button } from '@mantine/core';
import NextImage from 'next/image';
import NextLink from 'next/link';
import Layout from '@/components/Layout/Layout'
import FAQs from '@/components/FAQ/FAQ';
import FeatureCards from '@/components/FeatureCards/FeatureCards';
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <Layout
      title="ImmoRadar | Ihr Partner für den Weg ins Eigenheim"
      description="Ob Sie nach einem passenden Grundstück suchen, Fertighausanbieter vergleichen oder Ihr Budget für den Traum vom Eigenheim kalkulieren möchten – ImmoRadar bietet Ihnen die Lösungen, die Sie brauchen, um Ihr Projekt voranzubringen."
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
      <Box component="section" py={{ base: "6rem", sm: "10rem" }}>
        <Flex direction={{ base: "column", sm: "row" }} gap="xl">
          <Image
            radius="md"
            component={NextImage}
            src="/imgs/calculator.jpg"
            alt="Schreibtisch mit Taschenrechner"
            height={300}
            width={300}
            w={300}
          />
          <Box>
            <Title order={2} size="h1" mb="lg">
              Entdecken Sie Ihre Fördermöglichkeiten
            </Title>
            <Text mb="md">
              Ermitteln Sie schnell und unkompliziert, welche Förderungen und Zuschüsse für Ihren Hausbau oder Immobilienkauf verfügbar sind.
              Maximieren Sie Ihr Budget durch staatliche Unterstützung.
              Mit unserem Förderungscheck entdecken Sie alle relevanten Zuschüsse für Ihr Bauprojekt und nutzen staatliche Förderungen optimal aus.
            </Text>
            {/* <Button href="/foerderung" component={NextLink}>Förderungen finden</Button> */}
            <Text c="gray.6">
              Demnächst verfügbar
            </Text>
          </Box>
        </Flex>
      </Box>

      <Box component="section" py={{ base: "6rem", sm: "10rem" }} pos="relative">
        <div className={styles.background}></div>
        <Flex direction={{ base: "column-reverse", sm: "row" }} gap="xl">
          <Box>
            <Title order={2} size="h1" mb="lg">
              Ihr persönlicher Assistent für Fertighäuser
            </Title>
            <Text mb="md">
              Unser Assistent führt Sie durch den Angebotsdschungel der Fertighausanbieter.
              Finden Sie in wenigen Schritten den idealen Anbieter für Ihr Bauprojekt.
              Erhalten Sie eine Übersicht der besten Anbieter auf dem Markt und können die Angebote vergleichen, die am besten zu Ihnen passen.
            </Text>
            <Text c="gray.6">
              Demnächst verfügbar
            </Text>
          </Box>

          <Image
            radius="md"
            component={NextImage}
            src="/imgs/house.jpg"
            alt="Haus von vorne"
            height={300}
            width={300}
            w={300}
          />
        </Flex>
      </Box>

      <Box component="section" py={{ base: "6rem", sm: "10rem" }}>
        <Flex direction={{ base: "column", sm: "row" }} gap="xl">
          <Image
            radius="md"
            component={NextImage}
            src="/imgs/property.jpg"
            alt="Leeres Grundstück von oben"
            height={300}
            width={300}
            w={300}
          />
          <Box>
            <Title order={2} size="h1" mb="lg">
              Die Grundstückbörse für Suchende und Verkäufer
            </Title>
            <Text mb="md">
              Egal, ob Sie ein Grundstück kaufen oder verkaufen möchten - unsere Börse bringt Sie mit den richtigen Interessenten zusammen.
              Käufer finden schnell die passenden Angebote, während Verkäufer ihre Grundstücke einem großen Publikum präsentieren können.
            </Text>
            <Button href="/grundstueckboerse/finden" component={NextLink}>Grundstückbörse entdecken</Button>
          </Box>
        </Flex>
      </Box>

      <Box component="section" py={{ base: "6rem", sm: "10rem" }} pos="relative">
        <div className={styles.background}></div>
        <Flex direction={{ base: "column-reverse", sm: "row" }} gap="xl">
          <Box>
            <Title order={2} size="h1" mb="lg">
              Budgetrechner: So viel können Sie investieren
            </Title>
            <Text mb="md">
              Berechnen Sie schnell und einfach, wie viel Ihr Haus kosten darf.
              Unser Budgetrechner kalkuliert anhand von Eigenkapital, Zinssatz und monatlicher Belastung den maximalen Kaufpreis, den Sie sich leisten können.
            </Text>
            <Button href="/budgetrechner" component={NextLink}>Budget Berechnen</Button>
          </Box>

          <Image
            radius="md"
            component={NextImage}
            src="/imgs/calculator2.jpg"
            alt="Taschenrechner auf Schreibtisch"
            height={300}
            width={300}
            w={300}
          />
        </Flex>
      </Box>

      <Box component="section" py={{ base: "6rem", sm: "10rem" }}>
        <Flex direction={{ base: "column", sm: "row" }} gap="xl">
          <Image
            radius="md"
            component={NextImage}
            src="/imgs/property2.jpg"
            alt="Grundstück mit Haus"
            height={300}
            width={300}
            w={300}
          />
          <Box>
            <Title order={2} size="h1" mb="lg">
              Grundstückssuche leicht gemacht
            </Title>
            <Text mb="md">
              Suchen Sie Grundstücke über mehrere Plattformen hinweg an einem Ort.
              Mit unserer Suchfunktion vereinen wir Angebote von Portalen wie Immowelt, ImmoScout24 und vielen mehr – so finden Sie schnell das ideale Grundstück für Ihr Bauprojekt.
            </Text>
            <Button href="/suche" component={NextLink}>Jetzt Suchen</Button>
          </Box>
        </Flex>
      </Box>
    
      <Box pos="relative" py={{ base: "6rem", sm: "10rem" }}>
        <div className={styles.background}></div>
        <FAQs />
      </Box>
    </Layout>
  );
}
