import { Text, ThemeIcon, Title, List, rem } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import Link from 'next/link'
import CityLayout from '@/components/Layout/CityLayout'
import styles from '@/styles/Cities.module.css'

export default function Berlin() {
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
        Berlin ist ein spannender Ort zum Leben, und wir wissen, wie schwer es sein kann,
        die perfekte Wohnung in dieser lebendigen Stadt zu finden. Deshalb haben wir ImmoRadar
        entwickelt - deine persönliche Suchmaschine für Immobilien in Berlin. Egal, ob du eine kleine
        Wohnung mit einem Zimmer suchst oder Platz für die ganze Familie brauchst, wir haben alles im Blick.
      </Text>

      <Title order={2} mb="sm">Warum ImmoRadar?</Title>
      <Text mb="sm">
        ImmoRadar kombiniert für dich die besten Angebote aus allen relevanten Immobilienseiten in Deutschland.
        Du musst nicht mehr unzählige Webseiten durchforsten - bei uns findest du alles an einem Ort.
        Und das Beste? Du kannst Benachrichtigungen einstellen, die dich informieren, sobald eine neue Wohnung
        deinen Kriterien entspricht.
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
          <Link href="/search?q=Berlin&titleIncludes=WBS&page=1">Wohnungen in Berlin mit WBS</Link>: Für Wohnungssuchende mit Wohnberechtigungsschein (WBS) bieten wir gezielte Filter
          für Wohnungen, die deinen finanziellen Möglichkeiten entspricht.
        </List.Item>
        <List.Item mb="sm">
          <Link href="/search?q=Berlin&page=1&minRooms=1&maxRooms=1">1-Zimmer-Wohnungen in Berlin</Link>: Entdecke eine Vielzahl von Einzimmerwohnungen in Berlin,
          die zentral gelegen oder in ruhigen Wohngegenden zu finden sind.
        </List.Item>
        <List.Item mb="sm">
          2-, 3-, 4- und <Link href="/search?q=Berlin&page=1&minRooms=5&maxRooms=5">5-Zimmer-Wohnungen in Berlin</Link>: Für Familien, Wohngemeinschaften oder alle, die mehr Platz benötigen.
          Egal, ob du eine <Link href="/search?q=Berlin&page=1&minRooms=2&maxRooms=2">2-Zimmer-Wohnung</Link> in Prenzlauer Berg oder eine
          geräumige <Link href="/search?q=Berlin&page=1&minRooms=4&maxRooms=4">4-Zimmer-Wohnung</Link> in Charlottenburg suchst.
        </List.Item>
        <List.Item mb="sm">
          <Link href="/search?q=Berlin&titleIncludes=auf+Zeit&page=1">Wohnungen in Berlin auf Zeit</Link>: perfekt für deinen Übergang oder einen längeren Aufenthalt in
          Berlin. Finden möblierte Wohnungen in Berlin, die für kurze oder längere Zeiträume gemietet werden können.
        </List.Item>
        <List.Item>
          <Link href="/search?q=Berlin&page=1&titleIncludes=Garten">Wohnungen in Berlin mit Garten</Link>: Entdecken eine Auswahl an Wohnungen mit Garten, die sowohl in der
          Innenstadt als auch in den Randbezirken zu finden sind.
        </List.Item>
      </List>

      <Text mb="sm">
        Wir bei ImmoRadar wollen dir helfen, die Wohnung in Berlin zu finden, die perfekt zu dir
        passt - ohne Stress, ohne langes Suchen. Starte deine Suche jetzt und lass uns gemeinsam dein neues
        Zuhause in Berlin finden!
      </Text>
    </CityLayout>
  );
}
