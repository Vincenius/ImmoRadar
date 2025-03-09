import { Title, Text as MantineText, Flex, Box, Table, List, Divider } from '@mantine/core';
import { useEffect } from 'react';
import { toWords } from '@/utils/toWords';

// http://localhost:3000/pdf?id=67caa7d12bc95b3693a95892

export async function getServerSideProps({ req, res, resolvedUrl }) {
  const headerValue = req.headers['x-api-key'];

  if (!headerValue || headerValue !== process.env.API_KEY) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');
  const baseUrl = process.env.BASE_URL

  const data = await fetch(`${baseUrl}/api/contract?id=${id}`, {
    method: 'GET',
    headers: {
      'x-api-key': process.env.API_KEY
    }
  }).then(res => res.json())

  return {
    props: { data }, // data, baseUrl
  };
}

const mapFlatType = val => {
  const types = {
    'Sozialwohnung': 'eine öffentlich geförderte Wohnung (Sozialwohnung) oder eine sonst preisgebundene Wohnung',
    'Dienstwohnung': 'eine Dienstwohnung',
    'Werkwohnung': 'eine Werkwohnung',
    'Eigentumswohnung': 'eine Eigentumswohnung',
    'werkgeförderte Wohnung': 'eine werkgeförderte Wohnung',
  }

  return types[val] || val
}

const mapRentals = {
  'garage': 'Garage',
  'carport': 'Stellplatz',
  'garageContract': 'nach besonderem Garagen-/Stellplatz-Mietvertrag',
  'additionalContract': 'Die genaue Beschreibung der überlassenen Mietsache des Zubehörs ist in der Wohnungsbeschreibung und Übergabeverhandlung enthalten, die diesen Vertrag ergänzt.',
}

const mapUtilitiesType = {
  'Prepayment': 'Vorauszahlungen (mit Abrechnung)',
  'Flat': 'Pauschalen (ohne Abrechnung)',
}

const enclosureMap = {
  'DSGVO': 'Datenschutzerklärung (EU-DSGVO)',
  'Hausordnung': 'Hausordnung',
  'Lüftungsverhalten': 'Informationen zum Heiz- und Lüftungsverhalten',
  'Raumtemperaturen': 'Informationen zu den gesetzl. Raumtemperaturen',
  'Wohnungsübergabeprotokoll': 'Wohnungsübergabeprotokoll'
}

const PointFlex = ({ children, count, mb = "lg" }) => {
  return <Flex gap="md" mb={mb}>
    <Box w="40px">{count}.</Box>
    <Box w="100%">
      {children}
    </Box>
  </Flex>
}

const Text = ({ children, ...props }) => {
  return <MantineText ta="justify" {...props}>{children}</MantineText>
}

const PdfReport = ({ data }) => {
  console.log(data)
  useEffect(() => {
    document.body.style.backgroundColor = 'white';

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  // 8% of yearly rent
  const maxRepairCosts = (((parseFloat(data.rent.replace('€', '')) * 12) / 100) * 8).toFixed(2)

  return <>
    <Title order={1} size="h2" align="center" fw="500" mb="xl">Wohnraummietvertrag</Title>
    <Text align="center" mb="md">zwischen</Text>

    <Flex mb="md" gap="md">
      <Box w="30%">
        <Text>Vermieter</Text>
        <Text>wohnhaft in</Text>
        {data.landlordRepresentedBy && <Text>vertreten durch</Text>}
      </Box>
      <Box w="70%">
        <Text>{data.landlordName}</Text>
        <Text>{data.landlordAddress}</Text>
        {data.landlordRepresentedBy && <Text>{data.landlordRepresentedBy}</Text>}
      </Box>
    </Flex>

    <Text align="center" mb="md">und</Text>

    <Flex mb="3em" gap="md">
      <Box w="30%">
        <Text>Mieter</Text>
        <Text>wohnhaft in</Text>
      </Box>
      <Box w="70%">
        <Text>{data.tenantName}</Text>
        <Text>{data.tenantAddress}</Text>
      </Box>
    </Flex>

    {/* ------------------------------- § 1. Mietsache ------------------------------- */}
    <Text fw="bold" ta="center" my="lg">§ 1. Mietsache</Text>
    <PointFlex count="I">
      <Text>I.	Der Vermieter vermietet dem Mieter zu Wohnzwecken folgende Wohnung im Hause</Text>
      <Text>{data.address}</Text>
      {(data.level || data.location) && <Text>{data.level && `im ${data.level}. Geschoss`}{data.location && ` ${data.location}`}</Text>}
      <Text mb="md">bestehend aus</Text>
      <List mb="lg" withPadding>
        <List.Item>{data.rooms.count} {data.rooms.count > 1 ? 'Zimmern' : 'Zimmer'}</List.Item>
        {Object.entries(data.rooms).map(([key, value]) => {
          if (key !== 'count' && value > 0) {
            return <List.Item key={key}>{value} {key}</List.Item>
          }
        })}
        {data.additionalRooms.map(room => <List.Item key={room.name}>{room.count} {room.name}</List.Item>)}
      </List>


      {(data.rentals.length > 0 || data.additionalRentals.length > 0) && <>
        <Text mb="xs">Mitvermietet werden</Text>
        <List withPadding>
          {data.additionalRentals.map(asset => <List.Item key={asset}>{asset}</List.Item>)}
          {data.rentals.map(asset => <List.Item key={asset}>{mapRentals[asset]}{asset === 'carport' && data.carportNumber ? ` Nr. ${data.carportNumber}` : ''}</List.Item>)}
        </List>
      </>}
    </PointFlex>

    <PointFlex count="II">
      <Text>Die Wohnung ist {mapFlatType(data.flatType)}</Text>
    </PointFlex>

    <PointFlex count="III" mb="xl">
      {(data.sharedAssets.length > 0) && <>
        <Text mb="xs">Der Mieter ist berechtigt, folgende gemeinschaftliche Einrichtungen und Anlagen nach Maßgabe der Hausordnung mitzubenutzen:</Text>
        <List withPadding>
          {data.sharedAssets.map(asset => <List.Item key={asset}>{asset}</List.Item>)}
        </List>
      </>}

      {data.visitedDate && <Text mt="md">Das Mietobjekt wurde vor Abschluss des Mietvertrages am {new Date(data.visitedDate).toLocaleDateString('de-DE')} eingehend durch den/die Mieter besichtigt.</Text>}
    </PointFlex>


    {/* ------------------------------- § 2. Miete ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 2. Miete</Text>

    <PointFlex count="I">
      <Text>Die Miete beträgt monatlich EUR {data.rent.replace('€', '')}. (in Worten: EUR {toWords(parseFloat(data.rent.replace('€', '')))}.)</Text>
    </PointFlex>

    <PointFlex count="II">
      <Text mb="md">Neben der Miete werden folgende Betriebskosten im Sinne von § 2 Betriebskostenverordnung umgelegt und durch {mapUtilitiesType[data.utilitiesType]} in Höhe von EUR {data.utilities.replace('€', '')} erhoben:</Text>

      <List withPadding listStyleType="decimal">
        <List.Item>Die laufenden öffentlichen Lasten des Grundstücks, namentlich die Grundsteuer</List.Item>
        <List.Item>Die Kosten der Wasserversorgung</List.Item>
        <List.Item>Die Kosten der Entwässerung</List.Item>
        <List.Item>
          Die Kosten des Betriebs der zentralen Heizungsanlage einschließlich der Abgasanlage, Reinigung und Wartung der Heizung und Warmwassergeräte oder die Kosten des Betriebs der zentralen Brennstoffversorgungsanlage oder die Kosten eigenständig gewerblicher Lieferung von Wärme
        </List.Item>
        <List.Item>
          Die Kosten des Betriebs der zentralen Warmwasserversorgungsanlage oder die Kosten der eigenständig gewerblichen Lieferung von Warmwasser oder Kosten der Reinigung und Wartung von Warmwassergeräten
        </List.Item>
        <List.Item>Die Kosten verbundener Heizungs- und Warmwasserversorgungsanlagen</List.Item>
        <List.Item>Die Kosten des Betriebs-, Personen- oder Lastenaufzugs</List.Item>
        <List.Item>
          Die Kosten der Straßenreinigung und Müllbeseitigung; hierzu gehören insbesondere die für öffentliche Straßenreinigung und für die Müllabfuhr zu entrichtenden Gebühren
        </List.Item>
        <List.Item>Die Kosten der Gebäudereinigung und Ungezieferbekämpfung</List.Item>
        <List.Item>Die Kosten der Gartenpflege</List.Item>
        <List.Item>Die Kosten der Allgemeinbeleuchtung</List.Item>
        <List.Item>Die Kosten der Schornsteinreinigung</List.Item>
        <List.Item>Die Kosten der Sach- und Haftpflichtversicherung</List.Item>
        <List.Item>Die Kosten für den Hauswart</List.Item>
        <List.Item>
          Die Kosten des Betriebs der Gemeinschaftsantennenanlage bzw. Satellitenanlage oder die Kosten des Betriebs der mit einem Breitbandkabelnetz verbundenen privaten Verteileranlage
        </List.Item>
        <List.Item>Die Kosten des Betriebs der Einrichtung für die Wäschepflege</List.Item>
        <List.Item>Wartungskosten der Rauchmelder</List.Item>
        <List.Item>
          Sonstige Betriebskosten
          <List withPadding listStyleType="lower-alpha">
            <span>Hierzu gehören folgende Betriebskosten im Sinne von §1 der BetrKV die von den obigen
              Nummern 1-17 nicht erfasst sind, Dazu zählen die Kosten des Betriebs, der Wartung, Reinigung und Überprüfung der
            </span>
            <List.Item>Hausanschlüsse</List.Item>
            <List.Item>Be- und Entwässerungssysteme (einschließlich Rückstausicherungen)</List.Item>
            <List.Item>Elektrische Leitungen und Anlagen, Außenbeleuchtung, Blitzschutzanlagen</List.Item>
            <List.Item>Heizungs-/Warmwasserleitungen, Gasleitungen</List.Item>
            <List.Item>Feuerlöschgeräte, Rauchwarnanlagen, Rauchwarnmelder, Rauchabzugsanlage</List.Item>
            <List.Item>Tiefgaragen und deren Toren</List.Item>
            <List.Item>Garagentore, Dachrinnen, Dachflächen, Solaranlagen, Lüftungsanlagen, Zuluft- und Abluftanlagen, Kälteanlagen</List.Item>
            <List.Item>Fenster sowie Türen und Fassaden, sowie Kosten der Trinkwasseruntersuchung</List.Item>
            <List.Item>Die Kosten der Pflege der Dach- und Fassadenbegrünung</List.Item>
          </List>
        </List.Item>
      </List>
    </PointFlex>

    <PointFlex count="III">
      <Text>Die monatlichen Vorauszahlungen auf die Heizkosten betragen EUR {data.heating.replace('€', '')}	</Text>
    </PointFlex>

    <PointFlex count="IV">
      <Text mb="md">
        Sind Vorauszahlungen vereinbart, so wird über sie jährlich einmal abgerechnet.
        Die Abrechnung erfolgt unverzüglich, sobald die Abrechnungsunterlagen dem
        Vermieter vorliegen. Der Mieter ist berechtigt, in angemessener Zeit nach Zugang
        der Abrechnung die Unterlagen während der üblichen Geschäftszeiten bei dem
        Vermieter oder der von ihm bestimmten Stelle einzusehen. Eine etwaige Differenz
        auf Grund der Abrechnung zu Gunsten des Vermieters (des Mieters) hat der Mieter
        (Vermieter) innerhalb von einem Monat nach Zugang der Abrechnung an den Ver-
        Mieter (den Mieter) zu zahlen. Im Falle des Auszugs eines Mieters während der
        Abrechnungsperiode erfolgt die Verteilung bei der nächstfälligen Abrechnung im
        Verhältnis der Mietzeit zu der Abrechnungsperiode.
      </Text>

      <Text>Sind Betriebskostenpauschalen vereinbart, so vereinbaren die Parteien, dass Erhöhungen in der Form des § 560 Abs. 1 BGB auf den Mieter umgelegt werden können. </Text>
    </PointFlex>

    <PointFlex count="V">
      <Text>
        Werden öffentliche Abgaben neu eingeführt, erhöhen sich die Betriebskosten oder
        entstehen neue Betriebskosten, so können diese vom Vermieter im Rahmen der
        gesetzlichen Vorschriften umgelegt und angemessene Vorauszahlungen festgesetzt
        werden.
      </Text>
    </PointFlex>

    <PointFlex count="VI">
      <Text mb="md">Die abzurechnenden Kosten werden auf die Mieter wie folgt umgelegt:</Text>

      <List withPadding listStyleType="lower-alpha" mb="md">
        <List.Item>
          die Kosten des Betriebs einer zentralen Brennstoffversorgungsanlage nach dem
          anteiligen Verbrauch; jedoch zu 30% der Kosten nach dem Verhältnis der
          Wohnflächen
        </List.Item>
        <List.Item>
          die Kosten der Warmwasserversorgung, sofern sie nicht mit der Zentralheizung
          verbunden ist, nach dem durch Zähler ausgewiesene Verbrauch, jedoch zu 30%
          der Kosten nach dem Verhältnis der Wohnflächen;
        </List.Item>
      </List>

      <Text>Alle anderen Kosten werden nach dem Verhältnis der Wohnfläche umgelegt. Soweit es sich bei der Mietsache um eine Eigentumswohnung handelt, wird der Seitens der Eigentümer-gemeinschaft beschlossene Abrechnungsmaßstab für die Umlage der Betriebskosten zwischen Vermieter und Mieter vereinbart.</Text>
    </PointFlex>

    <PointFlex count="VII">
      <Text>
        Umlegungsmaßstab und Abrechnungszeitraum können vom Vermieter nach billigem
        Ermessen festgesetzt werden, wenn dies vertraglich nicht oder nicht vollständig geregelt
        ist. Sie können nach billigem Ermessen geändert werden, wenn dringende Gründe einer
        ordnungsgemäßen Bewirtschaftung es erfordern.
      </Text>
    </PointFlex>

    <PointFlex count="VIII">
      <Text>
        Der Vermieter ist berechtigt, die Miete einschließlich der Nebenkosten nach Maßgabe
        der gesetzlichen Vorschriften zu erhöhen. Dies gilt auch für Mietverhältnisse auf bestimmte Zeit.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 3. Mietzahlungen ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 3. Mietzahlungen</Text>

    <PointFlex count="I">
      <Text>
        Die Miete einschließlich der Nebenkostenvorauszahlung/Pauschalen ist monatlich
        im Voraus, spätestens am dritten Werktag des Monats kostenfrei an den Vermieter
        auf folgendes Konto zu zahlen:
      </Text>
      <Text>{data.bankAccount}</Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Für Rechtzeitigkeit der Zahlung kommt es nicht auf die Absendung, sondern auf den
        Eingang des Geldes an.
      </Text>
    </PointFlex>

    <PointFlex count="III">
      <Text>
        Bei Zahlungsverzug des Mieters ist der Vermieter berechtigt, für jede schriftliche
        Mahnung pauschalierte Mahnkosten in Höhe von 3,00 EUR sowie Verzugszinsen in
        Höhe von 5 % über dem jeweiligen Basiszinssatz der Deutschen Bundesbank
        (vgl. § 247 BGB) geltend zu machen.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 4. Kaution ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 4. Kaution</Text>

    <PointFlex count="I">
      <Text>
        Der Mieter leistet an den Vermieter zur Sicherung der Erfüllung seiner Verpflichtungen eine Kaution in Höhe von EUR {data.deposit.replace('€', '')}.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Der Vermieter verpflichtet sich, die Kaution getrennt von seinem Vermögen bei einer öffentlichen Sparkasse oder Bank, zu dem für Spareinlagen mit dreimonatiger Kündigungsfrist üblichen Zinssatz, anzulegen. Die Zinsen stehen dem Mieter zu. Sie erhöhen die Sicherheit.
      </Text>
    </PointFlex>

    <PointFlex count="III">
      <Text>
        Die Kaution kann in 3 Teilzahlungen gezahlt werden. Die erste Teilzahlung ist mit der ersten Mietzahlung fällig. Die weiteren Teilzahlungen werden zusammen mit den unmittelbar folgenden Mietzahlungen fällig
      </Text>
    </PointFlex>

    <PointFlex count="IV">
      <Text>
        Die Kaution ist dem Mieter frühestens 3 Monate nach Beendigung des Mietverhältnisses und zum Auszug des Mieters einschließlich Zinsen zurückzubezahlen, wenn dem Vermieter kein fälliger Gegenanspruch aus dem Mietverhältnis zusteht.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 5. Mietdauer ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 5. Mietdauer</Text>

    <PointFlex count="I">
      <Text>
        Das Mietverhältnis beginnt am {new Date(data.rentStart).toLocaleDateString('de-DE')} und läuft auf unbestimmte Zeit.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Wird der vermietete Wohnraum zur vereinbarten Zeit nicht zur Verfügung gestellt, so kann der
        Mieter Schadensersatz nur fordern, wenn der Vermieter die Verzögerung infolge Vorsatzes oder grober Fahrlässigkeit zu vertreten hat. Das Recht des Mieters zur Mietminderung oder zur fristlosen Kündigung wegen nicht rechtzeitiger Gebrauchsgewährung bleibt unberührt.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 6. Kündigung ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 6. Kündigung</Text>

    <PointFlex count="I">
      <Text>
        Der Mieter kann den Mietvertrag bis zum dritten Werktag eines Kalendermonats zum Ende
        des übernächsten Kalendermonats kündigen. Das Kündigungsrecht des Vermieters richtet
        sich nach den gesetzlichen Vorschriften.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Für die Rechtzeitigkeit der Kündigung kommt es nicht auf die Absendung, sondern auf den
        Zugang des Kündigungsschreibens an.
      </Text>
    </PointFlex>

    <PointFlex count="III">
      <Text>
        Die Kündigung ohne Einhaltung einer Kündigungsfrist (fristlose Kündigung) richtet sich nach
        den gesetzlichen Vorschriften. § 12 Abs. 3 bleibt unberührt.
      </Text>
    </PointFlex>

    <PointFlex count="IV">
      <Text>
        Die Kündigung muss schriftlich erfolgen. Im Übrigen sind die gesetzlichen Vorschriften zu
        beachten.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 7. Schönheitsreparaturen ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 7. Schönheitsreparaturen</Text>

    <PointFlex count="I">
      <Text>
        Die Schönheitsreparaturen während der Mietdauer übernimmt der Mieter auf eigene Kosten.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Zu den Schönheitsreparaturen gehört das Tapezieren, Anstreichen oder Kalken der Wände
        und Decken, das Streichen der Heizkörper einschließlich der Heizrohre, der Innentüren sowie der Fenster und Außentüren von innen und die Reinigung der vom Vermieter gestellten Teppichböden.
      </Text>
    </PointFlex>

    <PointFlex count="III">
      <Text>
        Hat der Mieter die Schönheitsreparaturen übernommen, so hat er je nach Grad der Abnutzung oder Beschädigung der Mieträume die erforderlichen Arbeiten auszuführen.
      </Text>
    </PointFlex>

    <PointFlex count="IV">
      <Text>
        Die Schönheitsreparaturen müssen fachgerecht ausgeführt werden. Kommt der Mieter seinen
        Verpflichtungen nicht nach, so kann der Vermieter nach fruchtloser Aufforderung des Mieters zur Durchführung der Arbeiten Ersatz der Kosten verlangen, die bei der Ausführung der Arbeiten erforderlich sind. Bei Nichterfüllung seiner Verpflichtungen nach Satz 1 hat der Mieter die Ausführung dieser Arbeiten während des Mietverhältnisses durch den Vermieter oder dessen
        Beauftragten zu dulden.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 8. Bagatellschäden ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 8. Bagatellschäden</Text>

    <PointFlex count="I">
      <Text>
        Der Mieter ist verpflichtet, die Kosten für kleinere Reparaturen wie folgt an den
        Vermieter zu zahlen: Für jede einzelne Reparatur dürfen die Kosten 100 Euro nicht übersteigen und der jährlichen Reparaturaufwand darf nicht mehr als 8 % der Jahresmiete, d. h. EUR {maxRepairCosts} betragen.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Die Kosten für kleine Reparaturen beziehen sich nur auf Schäden an den Installations-
        gegenständen, die dem direkten und häufigen Zugriff des Mieters ausgesetzt sind, wie die für Elektrizität, Wasser, Gas, den Heiz- und Kocheinrichtungen, den Fenster- und Türverschlüssen sowie den Verschlussvorrichtungen von Fensterläden oder Rollläden.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 9. Aufrechnung und Zurückbehaltung ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 9. Aufrechnung und Zurückbehaltung</Text>

    <PointFlex count="I">
      <Text>
        Der Mieter kann gegen eine Mietforderung mit einer Forderung aus §§ 536a, 539 BGB auf Schadens- und Aufwendungsersatz wegen Mängel der Mieträume oder einem Anspruch auf Rückzahlung zu viel gezahlter Miete aufrechnen oder ein Zurückbehaltungsrecht ausüben, wenn er diesem dem Vermieter mindestens einen Monat vor der Fälligkeit der Miete in Textform angezeigt hat. Wegen eines Rechts auf Minderung kann der Mieter ohne Einschränkung mit Gegenforderungen aufrechnen oder ein Zurückbehaltungsrecht ausüben.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Im Übrigen kann der Mieter nur aufrechnen, wenn seine Gegenforderung(en) unbestritten oder rechtskräftig festgestellt ist (sind). Unbeschadet von Abs. 1 kann der Mieter nur wegen Gegenforderung(en), die auf dem Mietverhältnis beruhen, ein Zurückbehaltungsrecht ausüben.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Das Leistungsverweigerungsrecht aus § 320 BGB bleibt unberührt.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 10. Zustand der Mieträume ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 10. Zustand der Mieträume</Text>

    <PointFlex count="I">
      <Text>
        Der Vermieter gewährt den Gebrauch der Mietsache in dem Zustand bei Übergabe.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Die verschuldensunabhängige Haftung des Vermieters für anfängliche Sachmängel wird ausgeschlossen. Im Übrigen kann der Mieter vom Vermieter Schadensersatz wegen Mängeln der Mietsache nur verlangen, soweit dem Vermieter Vorsatz oder grobe Fahrlässigkeit zur Last fällt. Dieser Haftungsausschluss gilt nicht für Schäden aus der Verletzung von Leben, Körper und Gesundheit. Das Recht des Mieters zur Mietminderung oder zur fristlosen Kündigung bleibt unberührt.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 11. Benutzung der Mietsache ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 11. Benutzung der Mietsache</Text>

    <PointFlex count="I">
      <Text>
        Der Mieter darf die Mietsache nur zu dem Vertrag bestimmten Zwecken benutzen.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text mb="md">
        Mit Rücksicht auf die Belange des Vermieters, die Gesamtheit der Mieter und im Interesse einer ordnungsgemäßen Bewirtschaftung des Hauses und der Wohnung bedarf der Mieter der vorherigen Zustimmung des Vermieters, wenn er
      </Text>
      <List withPadding listStyleType='numeric' mb="md">
        <List.Item mb="sm">
          den Gebrauch der Mietsache oder eines Teils derselben entgeltlich oder unentgeltlich Dritten überlassen will, es sei denn, es handelt sich um eine unentgeltliche Aufnahme von angemessener Dauer (Besuch);
        </List.Item>
        <List.Item mb="sm">
          die Mietsache oder einen Teil derselben zu anderen Wohnzwecken nutzen oder nutzen lassen will;
        </List.Item>
        <List.Item mb="sm">
          ein Schild (ausgenommen übliche Namensschilder an den dafür vorgesehenen Stellen), eine Aufschrift oder einen Gegenstand in gemeinschaftlichen Räumen, im oder am Haus oder auf dem Grundstück anbringen oder aufstellen will;
        </List.Item>
        <List.Item mb="sm">
          ein Tier halten will; ohne Zustimmung des Vermieters dürfen kleinere Tiere (z.B. Wellensittiche, Zierfische, Hamster) in den Wohnräumen gehalten werden, soweit sich die Anzahl der Tiere in den üblichen Grenzen hält und soweit nach der Art der Tiere und ihrer Unterbringung Belästigungen von Hausbewohnern der Mietsache und des Grundstücks nicht zu erwarten sind;
        </List.Item>
        <List.Item mb="sm">
          eine Antenne anbringen oder verändern will;
        </List.Item>
        <List.Item mb="sm">
          die Heizung, insbesondere auf Öl-, Gas-, oder Elektroheizung, umstellen will; dabei sind die gesetzlichen und behördlichen Vorschriften und etwaige in § 24 besonders vereinbarten Bestimmungen in jedem Fall zu beachten;
        </List.Item>
        <List.Item mb="sm">
          in den Mieträumen, im Haus oder auf dem Grundstück außerhalb vorgesehener Park-, Einstell- oder Abstellplätze ein Kraftfahrzeug, ein Moped oder ein Mofa abstellen will;
        </List.Item>
        <List.Item>
          Um -, An- und Einbauten sowie Installationen oder andere Veränderungen der Mietsache vornehmen will.
        </List.Item>
      </List>
    </PointFlex>

    <PointFlex count="III">
      <Text>
        Der Vermieter darf die Zustimmung zur Tierhaltung nicht verweigern, wenn Belästigungen der Hausbewohner und Nachbarn sowie Beeinträchtigungen der Mietsache und des Grundstücks nicht zu erwarten sind.
      </Text>
    </PointFlex>

    <PointFlex count="IV">
      <Text>
        Soweit und solange keine ausreichende Gemeinschaftsantenne und kein Breitbandkabelanschluss vorhanden ist, ist dem Mieter die Anbringung einer Einzelantenne oder einer
        Parabolantenne außerhalb der Mieträume gestattet. Die Anbringung hat im Einvernehmen mit dem Vermieter unter Beachtung der VDE- und der behördlichen Vorschriften fachmännisch zu erfolgen. Wenn nachträglich eine Gemeinschaftsantenne oder ein Breitbandkabelanschluss eingerichtet wird, hat der Mieter die Antenne auf seine Kosten zu entfernen und den alten Zustand wiederherzustellen.
      </Text>
    </PointFlex>

    <PointFlex count="V">
      <Text>
        Der Vermieter kann seine Zustimmung widerrufen, eine nach Absatz II Nr. 4 ohne Zustimmung zulässige Tierhaltung untersagen und die Beseitigung einer nach Absatz II Nr.5 angebrachte Antenne verlangen, wenn Auflagen nicht eingehalten, Hausbewohner oder Nachbarn belästigt werden oder wenn die Mietsache oder das Grundstück beeinträchtigt wird.
      </Text>
    </PointFlex>

    <PointFlex count="VI">
      <Text>
        Der Mieter haftet ohne Rücksicht auf eigenes Verschulden für alle Schäden, die durch besondere Nutzungen der Mietsache nach den vorgenannten Bestimmungen (siehe Absätze II bis IV) während der Überlassung der Mietsache an verursacht werden, auch wenn der Vermieter zugestimmt hat.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 12. Überlassung der Mietsache an Dritte – Untervermietung ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 12. Überlassung der Mietsache an Dritte – Untervermietung</Text>

    <PointFlex count="I">
      <Text>
        Es wird vereinbart, dass die Untervermietung oder Gebrauchsüberlassung an Dritte der schriftlichen Zustimmung des Vermieters bedarf (ausgenommen Lebensgefährten, Ehegatten).
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Will der Mieter einen Lebenspartner zum Zweck der Führung eines auf Dauer angelegten gemeinsamen Haushalts in die Wohnräume mit aufnehmen, so ist er verpflichtet, dem Vermieter die Personalien der einziehenden Person mitzuteilen, da ansonsten der Vermieter berechtigt ist, das Mietverhältnis unter Einhaltung der gesetzlichen Frist zu kündigen. Die Aufnahme kann verweigert werden, wenn gegen die Person ein wichtiger Grund vorliegt, der Wohnraum übermäßig belegt würde oder die Überlassung des Wohnraums an den Dritten aus sonstigen Gründen nicht zumutbar ist.
      </Text>
    </PointFlex>

    <PointFlex count="III">
      <Text>
        Der Vermieter ist zur fristlosen Kündigung berechtigt, wenn der Mieter ungeachtet einer schriftlichen Abmahnung des Vermieters einem Dritten den ihm unbefugt überlassenen Gebrauch belässt.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 13. Haushaltsmaschinen ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 13. Haushaltsmaschinen</Text>

    <PointFlex count="I">
      <Text>
        Der Mieter ist berechtigt, in den Mieträumen Haushaltsmaschinen (z.B. Wasch- und Geschirrspülmaschinen, Trockenautomaten) aufzustellen, wenn und soweit die Kapazität der vorhandenen Installationen ausreicht und Belästigungen der Hausbewohner und Nachbarn sowie Beeinträchtigung der Mietsache und des Grundstücks nicht zu erwarten sind. (siehe § 11).
      </Text>
    </PointFlex>

    {/* ------------------------------- § 14. Instandhaltung der Mietsache ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 14. Instandhaltung der Mietsache</Text>

    <PointFlex count="I">
      <Text>
        Der Mieter verpflichtet sich, die Mietsache und die zur gemeinschaftlichen Benutzung bestimmten Räume, Einrichtungen und Anlagen schonend und pfleglich zu behandeln. Er hat für die ordnungsgemäße Reinigung der Mietsache und für ausreichende Lüftung und Heizung der ihm überlassenen Räume zu sorgen.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Zeigt sich ein nicht nur unwesentlicher Mangel der Mietsache oder wird eine Vorkehrung zum Schutze der Mietsache oder des Grundstückes gegen eine nicht vorhergesehene Gefahr erforderlich, so hat der Mieter dies dem Vermieter unverzüglich mitzuteilen.
      </Text>
    </PointFlex>

    <PointFlex count="III">
      <Text>
        Der Mieter haftet für Schäden, die durch schuldhafte Verletzung der ihm obliegenden Sorgfalts- und Anzeigepflicht entstehen, wenn technische Anlagen und andere Einrichtungen unsachgemäß behandelt oder wenn die überlassenden Räume nur unzureichend gelüftet, geheizt oder gegen Frost geschützt werden. Insoweit haftet der Mieter auch für das Verschulden von Familienangehörigen, Hausangestellten, Untermietern und Personen, die sich mit seinem Willen in der Wohnung aufhalten oder ihn aufsuchen. Der Mieter hat zu beweisen, dass ein Verschulden nicht vorgelegen hat, wenn feststeht, dass die Schadensursache in dem durch die Benutzung der Mietsache abgegrenzten räumlich-gegenständlichen Bereich liegt; das gilt nicht für Schäden an Räumen, Einrichtungen und Anlagen, die mehrere Mieter gemeinsam benutzen.
      </Text>
    </PointFlex>

    <PointFlex count="IV">
      <Text>
        Der Vermieter wird die von ihm vertraglich übernommenen Arbeiten ausführen. Verzögert sich die Ausführung der Arbeiten, so ist der Mieter nicht berechtigt, den Mangel auf Kosten des Vermieters selbst zu beseitigen. Schadensersatz kann er nur fordern, wenn der Gebrauch der Mietsache nicht nur unerheblich gemindert ist und wenn der Vermieter die Verzögerung zu vertreten hat. Dieses gilt entsprechend, wenn Zugangswege und Außenanlagen nicht rechtzeitig fertig gestellt werden. Das Recht des Mieters zur Mietminderung bleibt unberührt.
      </Text>
    </PointFlex>

    <PointFlex count="V">
      <Text>
        Der Vermieter verpflichtet sich, die gemeinschaftlichen Zugänge, Räume, Einrichtungen und Anlagen in einem ordnungsgemäßen Zustand zu erhalten. Schäden hieran für die der Mieter haftet, darf der Vermieter auf Kosten des Mieters nach vorheriger Unterrichtung beseitigen.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 15. Elektrizität, Gas, Wasser ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 15. Elektrizität, Gas, Wasser</Text>

    <PointFlex count="I">
      <Text>
        Die vorhandenen Leitungsnetze für Elektrizität, Gas und Wasser dürfen vom Mieter nur in dem Umfang in Anspruch genommen werden, dass keine Überbelastung eintritt. Einen eventuellen Mehrbedarf kann der Mieter durch Erweiterung der Zuleitung auf eigene Kosten nach vorheriger Einwilligung des Vermieters decken.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Bei Störung und Schäden an der Versorgungsleitung hat der Mieter für sofortige Abschaltung zu sorgen und ist verpflichtet, den Vermieter oder seinen Beauftragten sofort zu benachrichtigen.
      </Text>
    </PointFlex>

    <PointFlex count="III">
      <Text>
        Eine Veränderung der Energieversorgung, insbesondere einer Abänderung der Stromspannung, berechtigt den Mieter nicht zu Ersatzansprüchen gegen den Vermieter.
      </Text>
    </PointFlex>

    <PointFlex count="IV">
      <Text>
        Bei Unterbrechung der Strom-, Gas- und Wasserversorgung oder Entwässerung durch einen Vermieter nicht zu vertretenden Umstand hat der Mieter keine Schadensersatzansprüche gegen den Vermieter.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 16.  Bauliche Veränderungen durch den Vermieter ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 16.  Bauliche Veränderungen durch den Vermieter</Text>

    <PointFlex count="I">
      <Text>
        Der Mieter hat Maßnahmen des Vermieters die zur Erhaltung des Mietgegenstandes erforderlich sind, sowie Maßnahmen zur Verbesserung der gemieteten Räume oder sonstiger Teile des Gebäudes zur Einsparung von Energie oder Wasser oder zur Schaffung neuen Wohnraums nach Maßgabe der § 554 BGB zu dulden. Der Mieter hat dabei die in Betracht kommenden Räume nach vorheriger Terminabsprache zugänglich zu halten und darf die Ausführungen der Arbeiten nicht schuldhaft behindern oder verzögern. Andernfalls haftet er für die hierdurch entstandenen Schäden.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Soweit der Mieter die Arbeiten zu dulden hat, kann er weder den Mietzins mindern noch Zurückbehaltungsrecht ausüben oder Schadensersatz verlangen. Ein Minderungsrecht steht dem Mieter jedoch für den Fall zu, dass die Maßnahmen des Vermieters den Gebrauch der Mieträume ganz ausschließen, erheblich beeinträchtigen oder zu besonderen Belästigungen des Mieters führen.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 17. Bauliche Änderungen durch den Mieter ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 17. Bauliche Änderungen durch den Mieter</Text>

    <PointFlex count="I">
      <Text>
        Bauliche Änderungen durch den Mieter, insbesondere Um- und Einbauten, Installationen und auch die Vergitterung der Fenster und die Herstellung oder Veränderung von Feuerstätten, dürfen nur mit schriftlicher Einwilligung des Vermieters vorgenommen werden. Erteilt der Vermieter eine solche Einwilligung, so ist der Mieter für die Einholung etwaiger bauaufsichtsrechlicher Genehmigungen verantwortlich und hat alle Kosten hierfür zu tragen.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Der Mieter haftet für alle Schäden, die im Zusammenhang mit den vom ihm vorgenommenen Baumaßnahmen entstehen.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 18. Betreten der Mietsache durch den Vermieter ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 18. Betreten der Mietsache durch den Vermieter</Text>

    <PointFlex count="I">
      <Text>
        Dem Vermieter oder seinem Beauftragten steht die Besichtigung des Mietgegenstandes nach rechtzeitiger Ankündigung zu angemessener Tageszeit frei. Zur Abwendung drohender Gefahren darf der Vermieter die Mieträume auch ohne vorherige Ankündigung zu jeder Tages- und Nachtzeit betreten.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Bei längerer Abwesenheit des Mieters ist sicherzustellen, dass die Rechte des Vermieters, die Mieträume nach Maßgabe des vorstehenden Absatzes zu betreten, rechtzeitig ausgeübt werden können.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 19. Rückgabe der Mietsache ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 19. Rückgabe der Mietsache</Text>

    <PointFlex count="I">
      <Text>
        Bei Ende des Mietvertrages hat der Mieter die Mietsache vollständig geräumt und sauber zu übergeben. Alle Schlüssel, auch vom Mieter selbst beschaffte, sind dem Vermieter zu übergeben. Der Mieter haftet für alle Schäden, die dem Vermieter oder einem Mietnachfolger aus der Nichtbefolgung dieser Pflicht entstehen.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Einrichtungen, mit denen der Mieter die Mietsache versehen hat, darf er wegnehmen. Der Vermieter kann die Ausübung des Wegnahmerechts durch Zahlung einer angemessenen Entschädigung abwenden, es sei denn, dass der Mieter ein berechtigtes Interesse an der Wegnahme hat.
      </Text>
    </PointFlex>

    <PointFlex count="III">
      <Text>
        Hat der Mieter bauliche Veränderungen an der Mietsache vorgenommen oder sie mit Einrichtungen versehen, so ist er auf Verlangen des Vermieters verpflichtet, bei Ende des Mietvertrages auf seine Kosten den ursprünglichen Zustand wiederherzustellen, sofern nichts anderes schriftlich vereinbart ist.
      </Text>
    </PointFlex>

    <PointFlex count="IV">
      <Text>
        Setzt der Mieter den Gebrauch der Mietsache nach Ablauf der Mietzeit fort, so gilt das Mietverhältnis nicht als verlängert. § 545 BGB findet keine Anwendung.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 20. Personenmehrheit als Mieter ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 20. Personenmehrheit als Mieter</Text>

    <PointFlex count="I">
      <Text>
        Haben mehrere Personen – z.B. Ehegatten – gemietet, so haften sie für alle Verpflichtungen aus dem Mietverhältnis als Gesamtschuldner.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Erklärungen, deren Wirkung die Mieter berühren, müssen von und gegenüber allen Mietern abgegeben werden. Die Mieter bevollmächtigen sich jedoch – unter Vorbehalt eines schriftlichen Widerrufs – bis auf weiteres gegenseitig zur Entgegennahme oder Abgabe solcher Erklärungen. Diese Vollmacht gilt auch für die Entgegennahme von Kündigungen, nicht jedoch für den Ausspruch von Kündigungen oder den Abschluss von Aufhebungsverträgen. Ein Widerruf der Vollmacht wird erst mit Zugang am Vermieter wirksam.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 21. Hausordnung ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 21. Hausordnung</Text>

    <PointFlex count="I">
      <Text>
        Vermieter und Mieter verpflichten sich zur Wahrung des Hausfriedens und zur gegenseitigen Rücksichtnahme.
      </Text>
    </PointFlex>

    <PointFlex count="II">
      <Text>
        Zur Aufrechterhaltung der Ordnung im Hause und für die Benutzung der Gemeinschaftsanlagen gilt die diesem Vertrag beigefügte Hausordnung. Sie kann vom Vermieter nur geändert werden, wenn dringende Gründe der Ordnung oder der Bewirtschaftung dies erfordern; diese Gründe sind dem Mieter zugleich mit der neuen Hausordnung mitzuteilen. Durch Bestimmung der Hausordnung können Bestimmungen dieses Vertrages sowie der Wohnungsbeschreibung und Übergabeverhandlung nicht geändert werden.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 22. Änderungen des Vertrages ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 22. Änderungen des Vertrages</Text>

    <PointFlex count="I">
      <Text>
        Änderungen dieses Vertrages bedürfen der Schriftform.
      </Text>
    </PointFlex>

    {/* ------------------------------- § 23. Salvatorische Klausel ------------------------------- */}
    <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 23. Salvatorische Klausel</Text>

    <PointFlex count="I">
      <Text>
        Sollten einzelne Klauseln dieses Vertrages unwirksam sein, bleibt der Vertrag im Übrigen wirksam.
      </Text>
    </PointFlex>

    {/* Zusätzliche vereinbarunge hier hin */}

    { (data.enclosures.length > 0 || data.additionalEnclosures.length > 0) && <>
      {/* ------------------------------- § 24. Anlagen ------------------------------- */}
      <Text fw="bold" ta="center" mt="3em" mb="1.5em">§ 24. Anlagen</Text>
      <List withPadding>
        {data.enclosures.map((enclosure, index) => <List.Item key={`enclosure-${index}`}>{enclosureMap[enclosure]}</List.Item>)}
        {data.additionalEnclosures.map((enclosure, index) => <List.Item key={`additional-enclosure-${index}`}>{enclosure}</List.Item>)}
      </List>
    </>}


    <Box mt="6em">
      <Divider w="50%" mb="sm" />
      
      <Text>(Ort, Datum, Unterschrift des Vermieters)</Text>
    </Box>

    <Box mt="6em">
      <Divider w="50%" mb="sm" />
      
      <Text>(Ort, Datum, Unterschrift des Mieters)</Text>
    </Box>
  </>;
};

export default PdfReport;
