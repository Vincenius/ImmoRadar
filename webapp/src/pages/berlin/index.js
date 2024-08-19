import { Flex, Text, ThemeIcon, Title, Box } from '@mantine/core';
import { IconClock, IconList, IconBell, IconArrowUp } from '@tabler/icons-react';
import Image from 'next/image'
import Layout from '@/components/Layout/Layout'
import Logos from '@/components/Logos/Logos'
import SearchBar from '@/components/SearchBar/SearchBar';
import styles from '@/styles/Cities.module.css'
import { Button } from '@mantine/core';

export default function Home() {
  return (
    <Layout
      title="ImmoRadar | Wohnungen in Berlin - Ihr neues Zuhause in der Hauptstadt finden"
      description="Kein mühsames Durchsuchen mehrerer Webseiten. Eine gut sortierte Liste ohne Duplikate und sofortige Updates bei neuen Angeboten."
    >
      <Box className={styles.header}>
        <Image src="/cities/berlin.jpg" alt="Berlin Skyline" layout="fill" className={styles.background} />

        <Flex mih="600px" h="calc(100vh - 70px - 64px)" direction="column" justify="space-evenly">
          <Box>
            <Title order={1} ta={{ base: 'center', md: 'center' }} fz={{ base: 34, xs: 42, sm: 60, md: 72 }} fw="bold" mb="lg" textWrap="balance" c="white">
              <span className={styles.gradientText}>Wohnungen in Berlin</span> Ihr neues Zuhause in der Hauptstadt finden
            </Title>

            <SearchBar city="Berlin" />
          </Box>
          <Flex justify="space-between" align={{ base: 'left', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={{ base: 'xl', sm: 'xl'}} maw={{ base: "350px", sm: "100%"}} m="0 auto">
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconClock size={24} /></ThemeIcon>
              <Text c="white" ta={{ base: 'left', sm: 'center'}}>Kein mühsames Durchsuchen mehrerer Webseiten</Text>
            </Flex>
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconList size={24} /></ThemeIcon>
              <Text c="white" ta={{ base: 'left', sm: 'center'}}>Eine einzige, gut sortierte Liste ohne Duplikate</Text>
            </Flex>
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconBell size={24} /></ThemeIcon>
              <Text c="white" ta={{ base: 'left', sm: 'center'}}>Benachrichtigungen bei neuen Angeboten</Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      <Logos />

      <Box my="6em">
        todo seo text
        {/* Berlin, die pulsierende Hauptstadt Deutschlands, bietet eine Vielzahl an Wohnmöglichkeiten, die den unterschiedlichsten Bedürfnissen gerecht werden. Ob Sie auf der Suche nach einer modernen Wohnung im Stadtzentrum, einer gemütlichen Einzimmerwohnung mit Garten oder einer geräumigen Wohnung für die ganze Familie sind – unsere Suchmaschine hilft Ihnen, die perfekte Wohnung in Berlin zu finden.
Finden Sie Ihre Traumwohnung in Berlin

Die Suche nach der idealen Wohnung in Berlin kann herausfordernd sein. Mit unserem umfassenden Angebot an Immobilienanzeigen haben Sie jedoch alle Möglichkeiten, genau das Zuhause zu finden, das Ihren Wünschen entspricht. Unsere Plattform bietet eine breite Auswahl an Wohnungen in Berlin, die regelmäßig aktualisiert werden.

    Wohnungen in Berlin WBS: Für Wohnungssuchende mit Wohnberechtigungsschein (WBS) bieten wir eine gezielte Suche nach passenden Wohnungen in Berlin. Finden Sie erschwinglichen Wohnraum, der Ihren finanziellen Möglichkeiten entspricht.

    1-Zimmer-Wohnungen in Berlin: Perfekt für Singles oder Studenten – entdecken Sie eine Vielzahl von Einzimmerwohnungen in Berlin, die zentral gelegen oder in ruhigen Wohngegenden zu finden sind.

    2-, 3-, 4- und 5-Zimmer-Wohnungen in Berlin: Für Familien, Wohngemeinschaften oder diejenigen, die einfach mehr Platz benötigen, bieten wir eine große Auswahl an Mehrzimmerwohnungen. Egal, ob Sie eine 2-Zimmer-Wohnung in Prenzlauer Berg oder eine geräumige 4-Zimmer-Wohnung in Charlottenburg suchen – bei uns werden Sie fündig.

    Wohnungen in Berlin auf Zeit: Sie sind nur für eine begrenzte Zeit in der Stadt? Kein Problem! Finden Sie bei uns möblierte Wohnungen in Berlin, die flexibel für kurze oder längere Zeiträume gemietet werden können.

    Wohnungen in Berlin mit Garten: Ein eigener Garten mitten in Berlin? Entdecken Sie unsere Auswahl an Wohnungen mit Garten, die sowohl in der Innenstadt als auch in den Randbezirken zu finden sind.

So einfach finden Sie Ihre Wohnung in Berlin

Unsere Suchmaschine ist benutzerfreundlich und ermöglicht Ihnen eine präzise Suche nach Wohnungen in Berlin. Nutzen Sie unsere Filter, um die Ergebnisse nach Ihren Vorlieben zu sortieren – sei es nach Größe, Zimmeranzahl, Preis oder Ausstattung. So finden Sie schnell die Angebote, die perfekt zu Ihnen passen.
Warum Berlin?

Berlin ist nicht nur eine Stadt, sondern ein Lebensgefühl. Mit ihrer dynamischen Kulturszene, den vielfältigen Arbeitsmöglichkeiten und den zahlreichen Freizeitangeboten bietet die Stadt einen Lebensstandard, der seinesgleichen sucht. Ob in den lebhaften Bezirken wie Mitte und Kreuzberg oder in den grünen, ruhigen Gegenden wie Zehlendorf und Köpenick – Berlin hat für jeden etwas zu bieten.

Machen Sie jetzt den ersten Schritt und finden Sie Ihre Wohnung in Berlin. Beginnen Sie Ihre Suche auf unserer Plattform und entdecken Sie, wie einfach es ist, in der Hauptstadt ein neues Zuhause zu finden. */}
      </Box>

      <Box my="6em">
        <Button
          variant="filled"
          size="lg"
          fullWidth
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          JETZT SUCHEN
          <IconArrowUp size={20} ml="sm"/>
        </Button>
      </Box>
    </Layout>
  );
}
