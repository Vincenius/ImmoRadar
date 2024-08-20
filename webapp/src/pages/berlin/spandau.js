import { Text, ThemeIcon, Title, List, rem } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import Link from 'next/link'
import CityLayout from '@/components/Layout/CityLayout'
import styles from '@/styles/Cities.module.css'

export default function Home() {
  return (
    <CityLayout
      title="Wohnungen in Berlin Spandau - Finden Sie Ihre Traumwohnung | ImmoRadar"
      description="Finden Sie Ihre Traumwohnung in Berlin Spandau mit ImmoRadar. Entdecken Sie aktuelle Angebote von 1- bis 5-Zimmer-Wohnungen, WBS-Wohnungen, möblierte Wohnungen auf Zeit und mehr. Jetzt suchen und direkt benachrichtigt werden!"
      city="Berlin-Spandau"
      headerImage="/cities/spandau.jpeg"
      titleContent={<>Wohnungen in <span className={styles.gradientText}>Berlin Spandau</span> - Finden Sie Ihre Traumwohnung</>}
      cta="button"
    >
      <Text mb="lg">
        Willkommen bei ImmoRadar, Ihrer zentralen Anlaufstelle für die besten Wohnungsangebote in Berlin Spandau.
        ImmoRadar durchsucht alle relevanten Immobilienportale in Deutschland und liefert Ihnen eine umfassende Auswahl an Wohnungen,
        die Ihren Bedürfnissen entsprechen. Egal, ob Sie eine gemütliche Ein-Zimmer-Wohnung oder eine geräumige Wohnung mit Garten suchen – bei
        uns finden Sie die passende Immobilie.
      </Text>

      <Title order={2} mb="sm">Wohnungen in Berlin Spandau: Entdecken Sie Ihr neues Zuhause</Title>
      <Text mb="sm">
        Berlin Spandau bietet eine perfekte Kombination aus urbanem Leben und grüner Umgebung.
        ImmoRadar präsentiert Ihnen eine Vielzahl von Wohnungen in diesem charmanten Bezirk, sodass Sie die beste Auswahl für Ihre Anforderungen haben:
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
          <Link href="/search?q=Berlin-Spandau&titleIncludes=WBS&page=1">Wohnung Berlin Spandau WBS</Link>: Entdecken Sie günstige Wohnungen mit Wohnberechtigungsschein (WBS) in Spandau.
          Wir bieten Ihnen eine breite Auswahl an verfügbaren WBS-Wohnungen, damit Sie schnell und unkompliziert einziehen können.
        </List.Item>
        <List.Item mb="sm">
          <Link href="/search?q=Berlin-Spandau&page=1&minRooms=1&maxRooms=1">Wohnung Spandau Berlin 1 Zimmer</Link>: Suchen Sie eine kompakte und kostengünstige Ein-Zimmer-Wohnung?
          Hier finden Sie attraktive Angebote, die perfekt für Singles oder Studenten geeignet sind.
        </List.Item>
        <List.Item mb="sm">
          Wohnung Spandau Berlin 2-5 Zimmer: Egal, ob Sie eine <Link href="/search?q=Berlin-Spandau&page=1&minRooms=2&maxRooms=2">Zwei-Zimmer-Wohnung</Link> für
          ein Pärchen oder eine geräumige <Link href="/search?q=Berlin-Spandau&page=1&minRooms=5&maxRooms=5">Fünf-Zimmer-Wohnung</Link> für die ganze Familie suchen – ImmoRadar hat die passenden Angebote für Sie.
        </List.Item>
        <List.Item mb="sm">
          <Link href="/search?q=Berlin-Spandau&titleIncludes=auf+Zeit&page=1">Wohnung Berlin Spandau auf Zeit</Link>:  Benötigen Sie eine Wohnung für einen begrenzten Zeitraum?
          Wir bieten Ihnen eine Auswahl an möblierten Wohnungen zur Zwischenmiete in Spandau.
        </List.Item>
        <List.Item>
          <Link href="/search?q=Berlin-Spandau&page=1&titleIncludes=Garten">Wohnung Berlin Spandau Garten</Link>: Träumen Sie von einer Wohnung mit eigenem Garten?
          Entdecken Sie unsere exklusiven Angebote für Wohnungen mit Garten in Berlin Spandau.
        </List.Item>
      </List>

      <Title order={2} mb="sm">So funktioniert ImmoRadar</Title>

      <Text mb="lg">
        Mit ImmoRadar ist die Wohnungssuche kinderleicht:
      </Text>
      <List type="ordered" mb="xl">
        <List.Item mb="sm"><b>Suchanfrage starten</b>: Geben Sie Ihre bevorzugten Suchkriterien ein, wie z.B. die Anzahl der Zimmer, die Wohnfläche oder besondere Ausstattungsmerkmale wie einen Garten.</List.Item>
        <List.Item mb="sm"><b>Ergebnisse vergleichen</b>: ImmoRadar durchsucht alle relevanten Immobilienportale und zeigt Ihnen die besten Treffer auf einen Blick.</List.Item>
        <List.Item mb="sm"><b>Benachrichtigungen einrichten</b>: Verpassen Sie kein neues Angebot! Richten Sie einfach Benachrichtigungen ein, und wir informieren Sie sofort, wenn eine passende Wohnung verfügbar ist.</List.Item>
      </List>

      <Title order={2} mb="sm">Warum Spandau?</Title>

      <Text mb="sm">
        Berlin Spandau ist ein Bezirk voller Vielfalt und Lebensqualität. Hier genießen Sie das Beste aus zwei Welten: die
        Dynamik der Großstadt und die Ruhe der Natur. Spandau bietet weitläufige Grünflächen, historische Sehenswürdigkeiten
        wie die Zitadelle Spandau und eine ausgezeichnete Anbindung an das Berliner Stadtzentrum. Mit seinen charmanten Wohnvierteln,
        familienfreundlichen Strukturen und einer wachsenden Infrastruktur ist Spandau ein begehrter Wohnort für alle, die in der Hauptstadt
        leben möchten, ohne auf Natur und Ruhe zu verzichten. Entdecken Sie mit ImmoRadar, warum Spandau der ideale Ort für Ihr neues Zuhause ist.
      </Text>
      
      <Text>
        Finden Sie noch heute Ihre ideale Wohnung in Berlin Spandau mit ImmoRadar – Ihrer umfassenden Immobilien-Suchmaschine.
        Starten Sie jetzt Ihre Suche und lassen Sie sich von uns auf dem Weg zu Ihrem neuen Zuhause begleiten.
      </Text>
    </CityLayout>
  );
}
