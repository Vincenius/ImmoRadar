import { Text, ThemeIcon, Title, List, rem } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import Link from 'next/link'
import CityLayout from '@/components/Layout/CityLayout'
import styles from '@/styles/Cities.module.css'

export default function Home() {
  return (
    <CityLayout
      title="Wohnungen in Berlin - Ihr neues Zuhause in der Hauptstadt finden | ImmoRadar"
      description="Mit unserem umfassenden Angebot an Wohnungen in Berlin haben Sie jedoch alle Möglichkeiten, genau das Zuhause zu finden, das Ihren Wünschen entspricht. ImmoRadar bietet eine breite Auswahl an Immobilien in Berlin, die regelmäßig aktualisiert werden."
      city="Berlin"
      headerImage="/cities/berlin.jpg"
      titleContent={<><span className={styles.gradientText}>Wohnungen in Berlin</span> Ihr neues Zuhause in der Hauptstadt finden</>}
      cta="search"
    >
      <Text mb="lg">
        Berlin, die pulsierende Hauptstadt Deutschlands, bietet eine Vielzahl an Wohnmöglichkeiten, die den unterschiedlichsten Bedürfnissen gerecht werden.
        Ob Sie auf der Suche nach einer modernen Wohnung im Stadtzentrum, einer gemütlichen Einzimmerwohnung mit Garten oder einer geräumigen Wohnung für
        die ganze Familie sind – ImmoRadar hilft Ihnen, die perfekte Wohnung in Berlin zu finden.
      </Text>

      <Title order={2} mb="sm">Finden Sie Ihre Traumwohnung in Berlin.</Title>
      <Text mb="sm">
        Die Suche nach der idealen Wohnung in Berlin kann herausfordernd sein
      </Text>
      <Text mb="sm">
        Mit unserem umfassenden Angebot an Immobilienanzeigen haben Sie jedoch alle Möglichkeiten, genau das Zuhause zu finden,
        das Ihren Wünschen entspricht. ImmoRadar bietet eine breite Auswahl an Wohnungen in Berlin, die regelmäßig aktualisiert werden.
      </Text>
      <Text mb="lg">
        ImmoRadar durchsucht alle gängigen Immobilien-Webseiten in Deutschland und fasst die Ergebnisse in einer einzigen,
        gut sortierte Liste ohne Duplikate zusammen.
      </Text>

      <List 
        mb="xl"
        icon={
          <ThemeIcon color="teal" size={24} radius="xl">
            <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
          </ThemeIcon>
        }
      >
        <List.Item mb="sm">
          <Link href="/search?q=Berlin&titleIncludes=WBS&page=1">Wohnungen in Berlin WBS</Link>: Für Wohnungssuchende mit Wohnberechtigungsschein (WBS) bieten wir eine gezielte Suche nach passenden Wohnungen in Berlin.
          Finden Sie erschwinglichen Wohnraum, der Ihren finanziellen Möglichkeiten entspricht.
        </List.Item>
        <List.Item mb="sm">
          <Link href="/search?q=Berlin&page=1&minRooms=1&maxRooms=1">1-Zimmer-Wohnungen in Berlin</Link>: Perfekt für Singles oder Studenten – entdecken Sie eine Vielzahl von Einzimmerwohnungen in Berlin,
          die zentral gelegen oder in ruhigen Wohngegenden zu finden sind.
        </List.Item>
        <List.Item mb="sm">
          2-, 3-, 4- und <Link href="/search?q=Berlin&page=1&minRooms=5&maxRooms=5">5-Zimmer-Wohnungen in Berlin</Link>: Für Familien, Wohngemeinschaften oder diejenigen, die einfach mehr Platz benötigen,
          bieten wir eine große Auswahl an Mehrzimmerwohnungen. Egal, ob Sie eine <Link href="/search?q=Berlin&page=1&minRooms=2&maxRooms=2">2-Zimmer-Wohnung</Link> in Prenzlauer Berg oder eine
          geräumige <Link href="/search?q=Berlin&page=1&minRooms=4&maxRooms=4">4-Zimmer-Wohnung</Link> in Charlottenburg suchen – bei uns werden Sie fündig.
        </List.Item>
        <List.Item mb="sm">
          <Link href="/search?q=Berlin&titleIncludes=auf+Zeit&page=1">Wohnungen in Berlin auf Zeit</Link>: Sie sind nur für eine begrenzte Zeit in der Stadt? Kein Problem! Finden Sie bei uns möblierte Wohnungen in Berlin,
          die flexibel für kurze oder längere Zeiträume gemietet werden können.
        </List.Item>
        <List.Item>
          <Link href="/search?q=Berlin&page=1&titleIncludes=Garten">Wohnungen in Berlin mit Garten</Link>: Ein eigener Garten mitten in Berlin? Entdecken Sie unsere Auswahl an Wohnungen mit Garten, die sowohl in der
          Innenstadt als auch in den Randbezirken zu finden sind.
        </List.Item>
      </List>

      <Title order={2} mb="sm">So finden Sie Ihre Wohnung in Berlin</Title>

      <Text mb="lg">
        Unsere Suchmaschine ist benutzerfreundlich und ermöglicht Ihnen eine präzise Suche nach Wohnungen in Berlin. Nutzen Sie unsere Filter, um die Ergebnisse nach Ihren Vorlieben zu sortieren – sei es nach Größe, Zimmeranzahl, Preis oder Ausstattung. So finden Sie schnell die Angebote, die perfekt zu Ihnen passen.
      </Text>

      <Title order={2} mb="sm">Warum Berlin?</Title>

      <Text mb="sm">
        Berlin ist nicht nur eine Stadt, sondern ein Lebensgefühl. Mit ihrer dynamischen Kulturszene, den vielfältigen Arbeitsmöglichkeiten und
        den zahlreichen Freizeitangeboten bietet die Stadt einen Lebensstandard, der seinesgleichen sucht. Ob in den lebhaften Bezirken wie Mitte
        und Kreuzberg oder in den grünen, ruhigen Gegenden wie Zehlendorf und Köpenick – Berlin hat für jeden etwas zu bieten.
      </Text>
      
      <Text>
        Machen Sie jetzt den ersten Schritt und finden Sie Ihre Wohnung in Berlin. Beginnen Sie Ihre Suche auf unserer Plattform und entdecken Sie,
        wie einfach es ist, in der Hauptstadt ein neues Zuhause zu finden.
      </Text>

      {/* todo bezirke */}
    </CityLayout>
  );
}
