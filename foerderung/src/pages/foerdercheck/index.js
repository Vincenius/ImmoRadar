import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Flex, Text, Group, Button, Title, Box, TextInput, Stepper, Chip, Select, Card, List, ThemeIcon, Modal, NumberFormatter } from '@mantine/core';
import { IconHome, IconBackhoe, IconCheck } from '@tabler/icons-react'
import SelectButton from '@/components/Inputs/SelectButton';
import Layout from '@/components/Layout/Layout'
import { bundeslaender } from '@/utils/bundeslaender'
import CheckboxCard from '@/components/Inputs/CheckboxCard';
import trackEvent from '@/utils/trackEvent';
import Pricing from '@/components/Pricing/Pricing';
import Checkout from '@/components/Checkout/Checkout';
import ResultTable from '@/components/ResultTable/ResultTable';
import WithInfo from '@/components/WithInfo/WithInfo';
import headers from '@/utils/fetchHeader';

const helperTexts = {
  "Altersgerechter Umbau": "Umbauten, die die Wohnung oder das Haus barrierefrei machen – z. B. bodengleiche Dusche, breite Türen oder Treppenlifte.",
  "Batteriespeicher": "Stromspeicher für selbst erzeugten Solarstrom – erhöht die Unabhängigkeit vom Netz und wird oft gefördert.",
  "Baubegleitung": "Fachliche Unterstützung durch einen Energieeffizienz-Experten – oft Voraussetzung für die Förderung.",
  "Biomasse": "Heizsysteme, die mit Holz, Pellets oder Hackschnitzeln betrieben werden – klimafreundlich & förderfähig.",
  "Dämmung": "Energetische Verbesserung von Dach, Fassade, Boden oder Keller – Voraussetzung für viele Förderprogramme.",
  "Effizienzhaus": "Ein Gebäude mit besonders geringem Energieverbrauch – je besser der Standard, desto höher die Förderung.",
  "Einbruchschutz": "Sicherheitstechnik wie Fensterverriegelungen, Türsicherungen oder Alarmsysteme – oft durch KfW förderfähig.",
  "Energieberatung": "Individuelle Analyse des energetischen Zustands durch einen Experten – Grundlage für viele Förderungen und Sanierungsmaßnahmen.",
  "Erneuerbare Energien": "Allgemeine Kategorie für alle Maßnahmen, die Strom oder Wärme aus Sonne, Wind, Biomasse oder Umweltenergie gewinnen.",
  "Fenster / Haustür": "Der Austausch von Fenstern oder Haustüren kann Energie sparen – wichtig ist der Wärmeschutzstandard.",
  "Fernwärme": "Anschluss an ein zentrales Heiznetz – nachhaltig, wenn aus erneuerbaren Quellen oder Abwärme gespeist, und oft förderfähig.",
  "Heizungsoptimierung": "Austausch alter Heizsysteme durch effiziente oder erneuerbare Varianten – oft mit Zuschuss oder Kredit.",
  "Holzbau": "Bauen mit dem nachwachsenden Rohstoff Holz – klimafreundlich, oft schneller umzusetzen und förderfähig im Rahmen nachhaltigen Bauens.",
  "Ladestation": "Wandladestation für E-Autos – in Kombination mit Photovoltaik oder KfW-Förderung interessant.",
  "Lüftung": "Zentrale oder dezentrale Systeme zur Belüftung von Wohnräumen – oft in Kombination mit energetischer Sanierung gefördert.",
  "Passivhaus": "Gebäude mit extrem niedrigem Energiebedarf – benötigt kaum Heizwärme und erreicht höchste Förderstufen.",
  "Photovoltaik": "Solaranlage zur Stromerzeugung auf dem Dach – Basis für Eigenverbrauch und Einspeisevergütung.",
  "Smart Home": "Intelligente Steuerung von Licht, Heizung, Rollläden oder Alarmanlagen – Komfort und Effizienz in einem.",
  "Solarthermie": "Solaranlage zur Warmwasserbereitung oder Heizungsunterstützung – besonders bei älteren Gebäuden attraktiv.",
  "Sonstige Heizungen": "Weitere Heizsysteme, z. B. Hybridanlagen oder Nahwärme – Förderung abhängig von Technik und Effizienz.",
  "Wärmepumpe": "Nutzt Umweltwärme aus Luft, Erde oder Grundwasser – eine der meistgeförderten Heiztechniken.",
  "Wärmespeicher": "Systeme zur Zwischenspeicherung von Wärme – erhöhen die Effizienz von Heizungen und Solaranlagen, z. B. Pufferspeicher."
};

export async function getServerSideProps({ resolvedUrl }) {
  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');
  const baseUrl = process.env.BASE_URL

  if (!id) {
    const subsidyData = await fetch(`${baseUrl}/api/subsidies`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.API_KEY,
        ...headers
      }
    }).then(res => res.json())
    return {
      props: { subsidyData },
    };
  }

  const [data, subsidyData] = await Promise.all([
    fetch(`${baseUrl}/api/subsidies?id=${id}`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.API_KEY,
        ...headers
      }
    }).then(res => res.json()),
    fetch(`${baseUrl}/api/subsidies`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.API_KEY,
        ...headers
      }
    }).then(res => res.json()),
  ])

  return {
    props: { defaultData: data, subsidyData, baseUrl },
  };
}

const SelectChip = ({ children, data, setData, value, ...props }) => {
  const handleChange = () => {
    setData({
      ...data,
      Measures: data['Measures']?.includes(value)
        ? data['Measures']?.filter((m) => m !== value)
        : [...(data['Measures'] || []), value]
    })
  }
  return (
    <Chip
      size="lg"
      variant="outline"
      styles={{ root: { flexGrow: 1 }, label: { width: '100%', justifyContent: 'center' } }}
      checked={data['Measures']?.includes(value)}
      onChange={handleChange}
      {...props}
    >
      {children}
    </Chip>
  )
}

const numberFormatElements = ['Postalcode']

const ButtonGroup = ({ active, setActive, isLoading, hasSubmit, disabled, id }) => {
  return <Group justify="space-between" mt="xl">
    {active === 0 && <div></div>}
    {active > 0 && <Button variant="default" onClick={() => setActive(active - 1)} loading={isLoading}>Zurück</Button>}
    {active < 4 && <Flex gap="sm">
      {hasSubmit && <Button type="submit" loading={isLoading} disabled={disabled} id={id}>
        {active === 3 ? 'Ergebnis anzeigen' : 'Weiter'}
      </Button>}
    </Flex>}
  </Group>
}

export default function Foerderung({ defaultData = {}, subsidyData, baseUrl }) {
  const defaultUser = defaultData?.user
  const hasDefaultData = !!defaultUser?.uuid

  const router = useRouter()
  const [active, setActive] = useState(hasDefaultData ? 4 : 0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    TypZuschuss: defaultUser?.Types?.includes('Zuschuss') || true,
    TypKredit: defaultUser?.Types?.includes('Kredit') || true,
    HouseType: defaultUser?.HouseType || null,
    Region: defaultUser?.Region || null,
    District: defaultUser?.District || null,
    Measures: defaultUser?.Measures || []
  })
  const [email, setEmail] = useState(defaultUser?.Email || '')
  const [name, setName] = useState(defaultUser?.Name || '')
  const [showFreeCheckout, setShowFreeCheckout] = useState(false)
  const [variant, setVariant] = useState()
  const [checkoutId, setCheckoutId] = useState()

  useEffect(() => {
    router.beforePopState(() => {
      const currentPath = router.asPath;
      if (active > 0) {
        window.history.pushState(null, "", currentPath);
        setActive(active - 1)
        return false
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [active]);

  const selectOption = (e) => {
    let elem = e.target
    while (!elem.name) {
      elem = elem.parentElement
    }
    setData({ ...data, [elem.name]: elem.value })
    setActive(active + 1)
  }

  const handleSubmitNext = (e) => {
    e.preventDefault();
    setActive(active + 1)
  }

  const districtData = [...new Set(
    subsidyData
      .filter(d => d.Region === data.Region && d.District)
      .map(d => d.District)
  )].sort()

  const measuresData = [...new Set(
    subsidyData.filter(d =>
      d.HouseType.includes(data.HouseType) &&
      (d.Region === data.Region || d.Region === 'Bundesweit') &&
      (d.District === data.District || !d.District) &&
      (
        data.TypZuschuss && d.Type.includes('Zuschuss') ||
        data.TypKredit && d.Type.includes('Kredit')
      )
    ).map(d => d.Measures).flat().filter(Boolean)
  )].sort()

  const finalData = subsidyData.filter(d =>
    d.HouseType.includes(data.HouseType) &&
    (d.Region === data.Region || d.Region === 'Bundesweit') &&
    (d.District === data.District || !data.District || !d.District) &&
    (
      data.TypZuschuss && d.Type.includes('Zuschuss') ||
      data.TypKredit && d.Type.includes('Kredit')
    ) &&
    d.Measures?.some(element => data.Measures?.includes(element))
  )

  const finalDataAmount = finalData.reduce((acc, curr) => {
    const subAmount = data.Measures.reduce((subAcc, subCurr) => {
      return subAcc + curr.FundingDetails[subCurr]
    }, 0)
    return acc + subAmount
  }, 0)

  const handleSubmit = (e) => {
    e.preventDefault();

    const formObject = {};
    const elements = e.target.elements;
    for (let element of elements) {
      if (element.name) {
        if (numberFormatElements.includes(element.name)) {
          formObject[element.name] = parseInt(element.value.replaceAll(' ', ''));
        } else {
          formObject[element.name] = element.value;
        }
      }
    }

    const newData = {
      ...data,
      ...formObject
    }

    setData(newData)
    setActive(active + 1)
  }

  const handleSubmitReport = (e) => {
    e.preventDefault()
    trackEvent('foerdercheck-generate-free-report')
    setIsLoading(true)
    fetch('/api/subsidies', {
      method: 'POST',
      body: JSON.stringify({ data, email, name })
    })
      .then(res => res.json())
      .then(res => {
        router.push(`/foerdercheck/danke`)
      })
      .catch(() => console.log('error')) // todo error handling
      .finally(() => setIsLoading(false))
  }

  const goToPayment = (newVariant) => {
    setVariant(newVariant)
    setIsLoading(true)
    fetch('/api/subsidies', {
      method: 'POST',
      body: JSON.stringify({ data })
    })
      .then(res => res.json())
      .then(res => {
        setCheckoutId(res.id)
      })
      .catch(() => console.log('error')) // todo error handling
      .finally(() => setIsLoading(false))
  }

  return (
    <Layout
      title="Dein FörderCheck"
      description="Teile uns ein paar Informationen zu Deinem Vorhaben mit und beantworte gezielte Fragen. So stellen wir sicher, dass Du nur passende Förderprogramme erhältst."
      withBackground={true}
    >
      <Card my="xl" p="0">
        <Stepper
          active={active}
          onStepClick={setActive}
          size="1px"
          styles={{ separator: { marginInline: 0 }, stepIcon: { color: 'transparent' } }}
          allowNextStepsSelect={false}
        >
          <Stepper.Step>
            <Box p="xl">
              <Title order={2} size="h3" mb="xl" ta="center">Handelt es sich um eine Bestandsimmobilie oder einen Neubau?</Title>

              <Flex gap="md">
                <WithInfo infoText="Ein bereits gebautes Haus oder eine Wohnung, die modernisiert oder saniert werden soll.">
                  <SelectButton id="btn-bestand" name="HouseType" value="Bestand" onClick={selectOption} fullWidth isMultiLine={true}>
                    <Flex direction="column" gap="sm" align="center">
                      <IconHome size="2em" />
                      <Text fw="600" size="lg">Bestand</Text>
                    </Flex>
                  </SelectButton>
                </WithInfo>
                <WithInfo infoText="Die erstmalige Errichtung eines Gebäudes auf einem Grundstück – z.B. Eigenheim oder Mehrfamilienhaus.">
                  <SelectButton id="btn-neubau" name="HouseType" value="Neubau" onClick={selectOption} fullWidth isMultiLine={true}>
                    <Flex direction="column" gap="sm" align="center">
                      <IconBackhoe size="2em" />
                      <Text fw="600" size="lg">Neubau</Text>
                    </Flex>
                  </SelectButton>
                </WithInfo>
              </Flex>

              <ButtonGroup {...{ data, setData, active, setActive }} />
            </Box>
          </Stepper.Step>
          <Stepper.Step>
            <Box p="xl">
              <form onSubmit={handleSubmitNext}>
                <WithInfo infoText="Viele Förderprogramme unterscheiden zwischen Zuschüssen und Krediten. Wählen Sie aus, was besser zu Ihrem Vorhaben passt." inline>
                  <Title order={2} size="h3" mb="xl" ta="center">Welche Art der Förderung suchen Sie?</Title>
                </WithInfo>

                <Flex gap="md" direction={{ base: 'column', xs: 'row' }}>
                  <WithInfo infoText="Ein Zuschuss ist eine finanzielle Förderung, die Sie nicht zurückzahlen müssen. Ideal für Sanierung, Energie oder Modernisierung.">
                    <CheckboxCard handleChange={() => setData({ ...data, TypZuschuss: !data.TypZuschuss })} value={data.TypZuschuss} title="Zuschuss" />
                  </WithInfo>

                  <WithInfo infoText="Ein Förderkredit ist ein Zinsgünstiger Kredit.">
                    <CheckboxCard handleChange={() => setData({ ...data, TypKredit: !data.TypKredit })} value={data.TypKredit} title="Kredit" />
                  </WithInfo>
                </Flex>
                <ButtonGroup {...{ data, setData, active, setActive }} hasSubmit disabled={!data.TypZuschuss && !data.TypKredit} id="btn-type" />
              </form>
            </Box>
          </Stepper.Step>
          <Stepper.Step>
            <Box p="xl">
              <WithInfo infoText="Die Auswahl Ihrer Region hilft uns, passgenaue Förderangebote für Sie zu finden – lokal, landesweit und bundesweit." inline>
                <Title order={2} size="h3" mb="xl" ta="center">Wo liegt die Immobilie oder wo planen Sie zu bauen?</Title>
              </WithInfo>

              <form onSubmit={handleSubmit}>
                <Flex gap="md" direction={{ base: 'column', xs: 'row' }} align="flex-start">
                  <Box w="100%">
                    <Select
                      label="Bundesland"
                      data={bundeslaender}
                      required
                      mb="sm"
                      name="Region"
                      onChange={(value) => setData({ ...data, Region: value, District: null })}
                      value={data.Region}
                      size="lg"
                      w="100%"
                    />
                    <Text c="gray.7" size="sm">Bitte hier Dein Bundesland auswählen.</Text>
                  </Box>

                  <Box w="100%">
                    <Select
                      label="Kreis/Landkreis (optional)"
                      data={districtData || []}
                      placeholder={!data.Region ? 'Zuerst Bundesland auswählen' : !districtData || !districtData.length ? 'Keine Kreise vorhanden' : 'Kreis auswählen'}
                      mb="xs"
                      name="District"
                      onChange={(value) => setData({ ...data, District: value })}
                      value={data.District}
                      disabled={!districtData || !districtData.length}
                      size="lg"
                    />
                    <Text c="gray.7" size="sm">Einige Städte und Landkreise bieten zusätzliche Förderungen – z.B. für Familien, Klimaschutz oder Sanierung.</Text>
                  </Box>
                </Flex>

                <ButtonGroup active={active} setActive={setActive} hasSubmit disabled={!data.Region} id="btn-region" />
              </form>
            </Box>
          </Stepper.Step>
          <Stepper.Step>
            <Box p="xl">
              <Title order={2} size="h3" mb="xl" ta="center">Welche Maßnahmen planen Sie?</Title>

              <Chip
                checked={data.Measures?.length === measuresData.length}
                onChange={() => data.Measures?.length === measuresData.length
                  ? setData({ ...data, Measures: [] })
                  : setData({ ...data, Measures: measuresData })
                }
                size="lg"
                mb="md"
                radius="sm"
                styles={{ label: { width: '100%', justifyContent: 'center' } }}
              >
                Alle auswählen
              </Chip>

              <form onSubmit={handleSubmit}>
                <Flex gap="sm" wrap="wrap">
                  {measuresData.map((m) => (
                    <WithInfo key={m} infoText={helperTexts[m]} originalWidth offset={0}>
                      <SelectChip radius="sm" value={m} {...{ data, setData }}>{m}</SelectChip>
                    </WithInfo>
                  ))}
                </Flex>
                <ButtonGroup {...{ data, setData, active, setActive }} hasSubmit disabled={(data.Measures || []).length === 0} id="btn-measures" />
              </form>
            </Box>
          </Stepper.Step>
          <Stepper.Completed>
            <Box p="md">
              {(!variant || !checkoutId) && <>
                <Title order={2} size="h3" mb="md" ta="center" textWrap="balance">
                  Ergebnis: {finalData.length} {finalData.length > 1 ? 'Förderprogramme' : 'Förderprogramm'} {finalDataAmount > 0 && <>im Wert von bis zu <NumberFormatter suffix=",-€" value={finalDataAmount} thousandSeparator="." decimalSeparator="," decimalScale={0} /> </>}gefunden.
                </Title>

                <Text mb="xl">Wir haben Fördermittel gefunden, die genau zu Ihrem Vorhaben passen. In welcher Höhe sie ihre persönliche Förderung beantragen können finden sie mit unserer Premium Variante heraus.</Text>
                <ResultTable data={finalData.slice(0, 3)} dataLength={finalData.length} amount={finalDataAmount} showType={data.TypZuschuss && data.TypKredit} measures={data.Measures} />

                <Title order={2} size="h3" mb="lg" ta="center" textWrap="balance">
                  Erhalte jetzt Deinen vollständigen Förderreport als PDF.
                </Title>
                <List
                  spacing="xs"
                  mb="xl"
                  center
                  icon={
                    <ThemeIcon color="cyan.9" variant="outline" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  <List.Item>Alle Programme basieren auf tagesaktuellen Daten offizieller Stellen (z.B. KfW, BAFA, Länderportale).</List.Item>
                  <List.Item>Individuell berechnet nach Region, Maßnahme und Förderart.</List.Item>
                </List>

                <Pricing
                  plan="free"
                  showFree
                  CtaFree={<Button onClick={() => setShowFreeCheckout(true)} loading={isLoading} fullWidth id="btn-free">
                    Kostenlos testen
                  </Button>}
                  CtaStarter={<Button onClick={() => goToPayment('starter')} loading={isLoading} fullWidth id="btn-starter">
                    Jetzt Kaufen
                  </Button>}
                  CtaPremium={<Button onClick={() => goToPayment('premium')} loading={isLoading} fullWidth id="btn-premium">
                    Jetzt Kaufen
                  </Button>}
                  CtaPremiumPlus={<Button onClick={() => goToPayment('premium')} loading={isLoading} fullWidth disabled>
                    Mit Premium verfügbar
                  </Button>}
                />

                <Button
                  variant="default" w="30%"
                  onClick={() => setActive(active - 1)}
                >Zurück</Button>
              </>}

              <Modal opened={showFreeCheckout} onClose={() => setShowFreeCheckout(false)}>
                <Flex gap="md" direction={{ base: "column", sm: "row" }} p="sm">
                  <form onSubmit={handleSubmitReport}>
                    <Title size="h4" order={3} mb="sm">Erhalte jetzt Deinen kostenlosen Report als PDF</Title>
                    <Text mb="md" fs="sm">Der kostenlose Report enthält die Links zu den gefundenen Fördernungen und weitere hilfreiche Informationen.</Text>

                    <TextInput
                      required
                      label="Dein Name"
                      placeholder="Max Musterman"
                      mb="xs"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      miw={{ base: "100%", sm: "250px" }}
                    />

                    <TextInput
                      required
                      label="E-Mail Adresse"
                      placeholder="mustermann@example.com"
                      type="email"
                      mb="md"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      miw={{ base: "100%", sm: "250px" }}
                    />

                    <Button type="submit" loading={isLoading} mb="md" id="btn-send-report">
                      Report zusenden
                    </Button>
                    <Text size="xs" fs="italic">Mit dem Absenden stimmst Du unserer <a href="/datenschutz" target="_blank">Datenschutzerklärung</a> zu und willigst ein, dass wir Dir das angeforderte PDF sowie unseren Newsletter per E-Mail zusenden. Du kannst Deine Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.</Text>
                  </form>
                </Flex>

                <Button mt="lg" variant="outline" onClick={() => { setShowFreeCheckout(false) }} w="150px">Zurück</Button>
              </Modal>

              {(variant && checkoutId) && <>
                <Title order={2} size="h3" mb="xl" ta="center" textWrap="balance">
                  Förderreport kaufen
                </Title>

                <Checkout variant={variant} id={checkoutId} goBack={() => {
                  setVariant(null)
                  setCheckoutId(null)
                }} />
              </>}
            </Box>
          </Stepper.Completed>
        </Stepper>
      </Card>
    </Layout >
  );
}
