import { Text, ThemeIcon, Title, List, rem } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import Link from 'next/link'
import CityLayout from '@/components/Layout/CityLayout'
import styles from '@/styles/Cities.module.css'

export default function Home() {
  return (
    <CityLayout
      title="Wohnungen in Berlin Spandau - Alle Ergebnisse von 9 Immobilien-Webseiten | ImmoRadar"
      description="Finden Deine Traumwohnung in Berlin Spandau mit ImmoRadar. Entdecke aktuelle Angebote von 1- bis 5-Zimmer-Wohnungen, WBS-Wohnungen, möblierte Wohnungen auf Zeit und mehr. Jetzt suchen und direkt benachrichtigt werden!"
      city="Berlin-Spandau"
      cityTitle="Spandau"
      headerImage="/cities/spandau.jpeg"
      titleContent={<>Wohnungen in <span className={styles.gradientText}>Berlin Spandau</span> - Finden Deine Traumwohnung</>}
      cta="button"
      count="110"
    >
      <Text mb="lg">
        Du suchst eine Wohnung in Berlin Spandau?
        Wir durchsuchen alle relevanten Immobilienseiten für Spandau und sammeln die aktuellen Angebote
        Egal ob du auf der Suche nach einem Ein-Zimmer-Apartment oder einer Wohnung mit Garten bist.
      </Text>

      <Title order={2} mb="sm">Warum ImmoRadar für Wohnungen in Berlin Spandau?</Title>
      <Text mb="sm">
        Wir wissen, wie anstrengend die Wohnungssuche sein kann. Deswegen haben wir ImmoRadar entwickelt.
        Hier findest du alle Angebote von allen wichtigen Immobilienseiten auf einen Blick.
        Du sparst dir stundenlanges Durchsuchen verschiedener Plattformen.
        Außerdem kannst dir Benachrichtigungen einrichten, damit du keine neuen Angebote mehr verpasst.
      </Text>

      <Text mb="sm">
        <b>Bei uns findest du:</b>
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
          <Link href="/search?q=Berlin-Spandau&titleIncludes=WBS&page=1">Wohnung Berlin Spandau WBS</Link>: Entdecke günstige Wohnungen mit Wohnberechtigungsschein (WBS) in Spandau.
        </List.Item>
        <List.Item mb="sm">
          <Link href="/search?q=Berlin-Spandau&page=1&minRooms=1&maxRooms=1">Wohnung Spandau Berlin 1 Zimmer</Link>: Suchst du eine kompakte und kostengünstige Ein-Zimmer-Wohnung?
          Hier findst du attraktive Angebote, die perfekt für Singles oder Studenten geeignet sind.
        </List.Item>
        <List.Item mb="sm">
          Wohnung Berlin Spandau 2-5 Zimmer: Egal, ob du eine <Link href="/search?q=Berlin-Spandau&page=1&minRooms=2&maxRooms=2">Zwei-Zimmer-Wohnung</Link> für
          ein Pärchen oder eine geräumige <Link href="/search?q=Berlin-Spandau&page=1&minRooms=5&maxRooms=5">Fünf-Zimmer-Wohnung</Link> für die ganze Familie suchst.        </List.Item>
        <List.Item mb="sm">
          <Link href="/search?q=Berlin-Spandau&titleIncludes=auf+Zeit&page=1">Wohnung Berlin Spandau auf Zeit</Link>: Benötigst du eine Wohnung für einen begrenzten Zeitraum?
          Wir verlinken eine Auswahl an möblierten Wohnungen zur Zwischenmiete in Spandau.
        </List.Item>
        <List.Item>
          <Link href="/search?q=Berlin-Spandau&page=1&titleIncludes=Garten">Wohnung Berlin Spandau Garten</Link>:
          Entdecke unsere Angebote für Wohnungen mit Garten in Berlin Spandau.
        </List.Item>
      </List>

      <Text>
        Starte jetzt mit ImmoRadar und finde genau die Wohnung in Berlin Spandau, die zu dir passt.
        Wir freuen uns darauf, dir zu helfen!
      </Text>
    </CityLayout>
  );
}
