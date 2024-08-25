import { Text, ThemeIcon, Title, List, rem } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import Link from 'next/link'
import CityLayout from '@/components/Layout/CityLayout'
import styles from '@/styles/Cities.module.css'

export default function Home() {
  return (
    <CityLayout
      title="Wohnungen in Berlin Mitte - Alle Ergebnisse von 9 Immobilien-Webseiten | ImmoRadar"
      description="Finden Deine Traumwohnung in Berlin Mitte mit ImmoRadar. Entdecke aktuelle Angebote von 1- bis 5-Zimmer-Wohnungen, WBS-Wohnungen, möblierte Wohnungen auf Zeit und mehr. Jetzt suchen und direkt benachrichtigt werden!"
      city="Berlin-Mitte"
      cityTitle="Mitte"
      headerImage="/cities/mitte.jpg"
      titleContent={<>Wohnungen in <span className={styles.gradientText}>Berlin Mitte</span> - Leben im Zentrum von Berlin</>}
      cta="button"
      count="500"
    >
      <Text mb="lg">
        Du suchst eine Wohnung in Berlin Mitte?
        Wir durchsuchen alle relevanten Immobilienseiten für Berlin-Mitte und sammeln alle aktuellen Angebote.
        Egal ob du auf der Suche nach einer 3 Zimmer oder einer WBS-Wohnung bist.
      </Text>

      <Title order={2} mb="sm">Warum ImmoRadar für Wohnungen in Berlin Mitte?</Title>
      <Text mb="sm">
        Wir wissen, wie anstrengend die Wohnungssuche sein kann. Deswegen haben wir ImmoRadar entwickelt.
        Hier findest du alle Angebote von allen wichtigen Immobilienseiten auf einen Blick.
        Du sparst dir langes durchsuchen verschiedener Plattformen. Außerdem kannst dir Benachrichtigungen einrichten,
        damit du keine neuen Angebote mehr verpasst.
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
          <Link href="/search?q=Berlin-Mitte&titleIncludes=WBS&page=1">Wohnung Berlin Mitte WBS</Link>: Entdecke günstige Wohnungen mit Wohnberechtigungsschein (WBS) in Mitte.
        </List.Item>
        <List.Item mb="sm">
          <Link href="/search?q=Berlin-Mitte&page=1&minRooms=1&maxRooms=1">Wohnung Berlin Mitte 1 Zimmer</Link>: Auf der Suche nach einer kompakten und kostengünstige Ein-Zimmer-Wohnung?
          Hier findst du attraktive Angebote, die perfekt für Singles oder Studenten geeignet sind.
        </List.Item>
        <List.Item mb="sm">
          Wohnung Berlin Mitte 2-5 Zimmer: Egal, ob du eine <Link href="/search?q=Berlin-Mitte&page=1&minRooms=3&maxRooms=3">Drei-Zimmer-Wohnung</Link> für
          ein Pärchen oder eine geräumige <Link href="/search?q=Berlin-Mitte&page=1&minRooms=5&maxRooms=5">Fünf-Zimmer-Wohnung</Link> für die ganze Familie suchst.
        </List.Item>
        <List.Item mb="sm">
          <Link href="/search?q=Berlin-Mitte&titleIncludes=auf+Zeit&page=1">Wohnung Berlin Mitte auf Zeit</Link>: Du benötigst eine Wohnung für einen begrenzten Zeitraum?
          Wir verlinken eine Auswahl an möblierten Wohnungen zur Zwischenmiete in Mitte.
        </List.Item>
        <List.Item>
          <Link href="/search?q=Berlin-Mitte&page=1&titleIncludes=Neubau">Neubau Wohnung Berlin Mitte</Link>:
          Entdecke unsere Angebote für Neuabu Wohnungen in Berlin Mitte.
        </List.Item>
      </List>

      <Text>
        Starte jetzt mit ImmoRadar und finde genau die Wohnung in Berlin Mitte, die zu dir passt.
        Wir freuen uns darauf, dir zu helfen!
      </Text>
    </CityLayout>
  );
}
