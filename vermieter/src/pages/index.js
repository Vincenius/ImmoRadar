import { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { Flex, Title, Box, Card, Text, Stepper, ThemeIcon, TextInput, Group, Button, NumberInput, Grid } from '@mantine/core'
import SelectButton from '@/components/Inputs/SelectButton'
import { IconHomeShare, IconHome, IconHomeStar, IconPlus } from '@tabler/icons-react'
import Checkbox from '@/components/Inputs/Checkbox'
import { DateInput } from '@mantine/dates'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import IBAN from 'iban'

dayjs.extend(customParseFormat)

const numberFormatElements = []

const ButtonGroup = ({ active, setActive, disabled }) => {
  return <Group justify="space-between" mt="xl">
    {active === 0 && <div></div>}
    {active > 0 && <Button variant="default" onClick={() => setActive(active - 1)}>Zurück</Button>}
    <Button type="submit" disabled={disabled}>Weiter</Button>
  </Group>
}

function Mietvertraege() {
  const [active, setActive] = useState(0)
  const [data, setData] = useState({ visited: true, rooms: {}, rentals: {} })
  const [additionalRooms, setAdditionalRooms] = useState([])
  const [additionalRentals, setAdditionalRentals] = useState([])
  const [additionalEnclosures, setAdditionalEnclosures] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasIbanError, setHasIbanError] = useState(false)

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

    if (formObject.bankAccount && !IBAN.isValid(formObject.bankAccount)) {
      setHasIbanError(true)
    } else {
      const newData = {
        ...data,
        ...formObject
      }
  
      setHasIbanError(false)
      setData(newData)
      setActive(active + 1)
    }
  }

  const generateDocument = () => {
    setIsLoading(true)

    const userData = {
      ...data,
      rentals: Object.entries(data.rentals).reduce((acc, [key, value]) => {
        if (value) {
          acc.push(key)
        }
        return acc
      }, []),
      additionalRooms,
      additionalEnclosures,
      additionalRentals,
    }

    fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userData }),
    }).then(res => res.json())
      .then(async res => {
        const response = await fetch(`/api/download?id=${res.insertedId}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Mietvertrag.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const selectOption = (e) => {
    let elem = e.target
    while (!elem.name) {
      elem = elem.parentElement
    }
    setData({ ...data, [elem.name]: elem.value })
    setActive(active + 1)
  }

  const sharedAssets = data?.sharedAssets || []
  const enclosures = data?.enclosures || []

  return (
    <Layout title="Mietvertrag Generator" noindex={true}>
      <Title mb="md">Mietvertrag Generator</Title>
      <Text mb="md">
        Erstelle schnell und unkompliziert individuelle Mietverträge. Einfach Daten eingeben, die Bedingungen anpassen und einen rechtskonformen Mietvertrag erhalten.
        Spare Zeit und sichere dir mit wenigen Klicks einen rechtssicheren Vertrag für dein Mietverhältnis.
      </Text>
      <Text mb="xl">
        Hier kommt ein Link zu einer Vorschau von einem Beispiel Mietvertrag
      </Text>

      <Card withBorder shadow="md">
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
          size="14px"
          styles={{ separator: { marginInline: 0 }, stepIcon: { color: 'transparent' } }}
        >
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Welche Art von Mietvertrag möchtest du abschließen?</Title>

            <SelectButton name="contract" value="Wohnraum" onClick={selectOption} w="100%" mb="md" isMultiLine={true}>
              <Flex gap="sm" align="center">
                <ThemeIcon variant="white">
                  <IconHome style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
                <Text size="xl" fw="500">Wohnraum<wbr />mietvertrag</Text>
              </Flex>
            </SelectButton>

            <SelectButton name="contract" value="Staffel" onClick={selectOption} w="100%" mb="md" isMultiLine={true} disabled>
              <Flex gap="sm" align="center">
                <ThemeIcon variant="white">
                  <IconHome style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
                <Text size="xl" fw="500">Staffel-Wohnraum<wbr />mietvertrag</Text>
              </Flex>
            </SelectButton>

            <SelectButton name="contract" value="Index" onClick={selectOption} w="100%" mb="md" isMultiLine={true} disabled>
              <Flex gap="sm" align="center">
                <ThemeIcon variant="white">
                  <IconHome style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
                <Text size="xl" fw="500">Index-Wohnraum<wbr />mietvertrag</Text>
              </Flex>
            </SelectButton>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Wie lauten die vollständigen Angaben für Vermieter und Mieter?</Title>

            <form onSubmit={handleSubmit}>
              <Flex gap="md" justify="space-between" direction={{ base: "column", xs: "row" }}>
                <Box w="100%">
                  <Text fw="bold" mb="sm">Vermieter</Text>
                  <TextInput
                    label="Name"
                    placeholder="Max Mustermann"
                    required
                    mb="sm"
                    name="landlordName"
                    defaultValue={data.landlordName}
                  />
                  <TextInput
                    label="Straße und Hausnummer"
                    placeholder="Beispielstr. 12"
                    required
                    mb="sm"
                    name="landlordStreet"
                    defaultValue={data.landlordStreet}
                  />
                  <Flex gap="sm">
                    <NumberInput
                      label="Postleitzahl"
                      placeholder="12345"
                      required
                      mb="sm"
                      name="landlordZip"
                      defaultValue={data.landlordZip}
                      hideControls
                      decimalScale={0}
                      maxLength={5}
                    />
                    <TextInput
                      label="Stadt"
                      placeholder="Musterstadt"
                      required
                      mb="sm"
                      name="landlordCity"
                      defaultValue={data.landlordCity}
                    />
                  </Flex>
                  <TextInput
                    label="Vertreten durch (optional)"
                    placeholder="Fertighaus Radar Property GmbH"
                    mb="sm"
                    name="landlordRepresentedBy"
                    defaultValue={data.landlordRepresentedBy}
                  />
                </Box>
                <Box w="100%">
                  <Text fw="bold" mb="sm">Mieter</Text>
                  <TextInput
                    label="Name"
                    placeholder="Max Mustermann, Erika Mustermann"
                    required
                    mb="sm"
                    name="tenantName"
                    defaultValue={data.tenantName}
                  />
                  <TextInput
                    label="Straße und Hausnummer"
                    placeholder="Beispielstr. 12"
                    required
                    mb="sm"
                    name="tenantStreet"
                    defaultValue={data.tenantStreet}
                  />
                  <Flex gap="sm">
                    <NumberInput
                      label="Postleitzahl"
                      placeholder="12345"
                      required
                      mb="sm"
                      name="tenantZip"
                      defaultValue={data.tenantZip}
                      hideControls
                      decimalScale={0}
                      maxLength={5}
                    />
                    <TextInput
                      label="Stadt"
                      placeholder="Musterstadt"
                      required
                      mb="sm"
                      name="tenantCity"
                      defaultValue={data.tenantCity}
                    />
                  </Flex>
                </Box>
              </Flex>

              <ButtonGroup {...{ active, setActive }} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Wo befindet sie sich die Mietsache?</Title>
            <form onSubmit={handleSubmit}>
              <TextInput
                label="Straße und Hausnummer"
                placeholder="Beispielstr. 12"
                required
                mb="sm"
                name="street"
                defaultValue={data.street}
              />
              <Flex gap="sm" w="100%">
                <NumberInput
                  label="Postleitzahl"
                  placeholder="12345"
                  required
                  mb="sm"
                  name="zip"
                  defaultValue={data.zip}
                  w="100%"
                  hideControls
                  decimalScale={0}
                  maxLength={5}
                />
                <TextInput
                  label="Stadt"
                  placeholder="Musterstadt"
                  required
                  mb="sm"
                  name="city"
                  defaultValue={data.city}
                  w="100%"
                />
              </Flex>
              <TextInput
                label="Geschoss (optional)"
                placeholder="3"
                mb="sm"
                name="level"
                defaultValue={data.Level}
              />
              <TextInput
                label="Lage im Gebäude (optional)"
                placeholder="rechts/links/Mitte; Nr. 3 des Geschossplans)"
                mb="sm"
                name="location"
                defaultValue={data.Location}
              />
              <ButtonGroup {...{ active, setActive }} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Welche Räume umfasst die Mietsache?</Title>
            <form onSubmit={handleSubmit}>
              <Grid>
                <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                  <NumberInput
                    label="Zimmer"
                    placeholder="2"
                    required
                    mb="sm"
                    value={data.rooms.count || ''}
                    onChange={(value) => setData({ ...data, rooms: { ...data.rooms, count: value } })}
                    hideControls
                    decimalSeparator=","
                    decimalScale={1}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                  <NumberInput
                    label="WC"
                    placeholder="0"
                    mb="sm"
                    value={data.rooms['WC'] || ''}
                    onChange={(value) => setData({ ...data, rooms: { ...data.rooms, 'WC': value } })}
                    hideControls
                    decimalSeparator=","
                    decimalScale={1}

                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                  <NumberInput
                    label="Küche/Kochnische"
                    placeholder="0"
                    mb="sm"
                    value={data.rooms['Küche/Kochnische'] || ''}
                    onChange={(value) => setData({ ...data, rooms: { ...data.rooms, 'Küche/Kochnische': value } })}
                    hideControls
                    decimalSeparator=","
                    decimalScale={1}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                  <NumberInput
                    label="Flur"
                    placeholder="0"
                    mb="sm"
                    value={data.rooms['Flur'] || ''}
                    onChange={(value) => setData({ ...data, rooms: { ...data.rooms, 'Flur': value } })}
                    hideControls
                    decimalSeparator=","
                    decimalScale={1}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                  <NumberInput
                    label="Bad"
                    placeholder="0"
                    mb="sm"
                    value={data.rooms['Bad'] || ''}
                    onChange={(value) => setData({ ...data, rooms: { ...data.rooms, 'Bad': value } })}
                    hideControls
                    decimalSeparator=","
                    decimalScale={1}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                  <NumberInput
                    label="Diele"
                    placeholder="0"
                    mb="sm"
                    value={data.rooms['Diele'] || ''}
                    onChange={(value) => setData({ ...data, rooms: { ...data.rooms, 'Diele': value } })}
                    hideControls
                    decimalSeparator=","
                    decimalScale={1}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                  <NumberInput
                    label="Dusche"
                    placeholder="0"
                    mb="sm"
                    value={data.rooms['Dusche'] || ''}
                    onChange={(value) => setData({ ...data, rooms: { ...data.rooms, 'Dusche': value } })}
                    hideControls
                    decimalSeparator=","
                    decimalScale={1}
                  />
                </Grid.Col>
                {additionalRooms.map((room, index) => (
                  <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }} key={index}>
                    <Flex gap="sm">
                      <NumberInput
                        w="33%"
                        label="Anzahl"
                        placeholder="2"
                        mb="sm"
                        value={room.count}
                        hideControls
                        decimalSeparator=","
                        decimalScale={1}
                        onChange={(value) => {
                          const newRooms = [...additionalRooms];
                          newRooms[index].count = value;
                          setAdditionalRooms(newRooms);
                        }}
                      />
                      <TextInput
                        w="67%"
                        label="Beschreibung"
                        placeholder="Balkon"
                        mb="sm"
                        value={room.name}
                        onChange={(event) => {
                          const newRooms = [...additionalRooms];
                          newRooms[index].name = event.target.value;
                          setAdditionalRooms(newRooms);
                        }}
                      />
                    </Flex>
                  </Grid.Col>
                ))}
                <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                  <Button mt="1.7em" mb="sm" fullWidth leftSection={<IconPlus size={14} />} variant="outline" onClick={() => setAdditionalRooms([...additionalRooms, { name: '', count: '' }])}>
                    Raum hinzufügen
                  </Button>
                </Grid.Col>
              </Grid>
              <ButtonGroup {...{ active, setActive }} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Was wird zusätzlich Mitvermietet?</Title>

            <Checkbox
              label="Garage"
              checked={data.rentals.garage || false}
              onChange={(event) => setData({ ...data, rentals: { ...data.rentals, garage: event.currentTarget.checked } })}
              mb="md"
            />
            <Checkbox
              label="Stellplatz"
              checked={data.rentals.carport || false}
              onChange={(event) => setData({ ...data, rentals: { ...data.rentals, carport: event.currentTarget.checked } })}
              mb={data.Carport ? "xs" : "md"}
            />
            {data.rentals.carport && (
              <TextInput
                label="Stellplatz Nr."
                placeholder="1"
                mb="md"
                name="carportNumber"
                defaultValue={data.carportNumber}
              />
            )}
            <Checkbox
              label="nach besonderem Garagen-/Stellplatz-Mietvertrag"
              checked={data.rentals.garageContract || false}
              onChange={(event) => setData({ ...data, rentals: { ...data.rentals, garageContract: event.currentTarget.checked } })}
              mb="md"
            />
            <Checkbox
              label="Die genaue Beschreibung der überlassenen Mietsache des Zubehörs ist in der Wohnungsbeschreibung und Übergabeverhandlung enthalten, die diesen Vertrag ergänzt."
              checked={data.rentals.additionalContract || false}
              onChange={(event) => setData({ ...data, rentals: { ...data.rentals, additionalContract: event.currentTarget.checked } })}
              mb="md"
            />

            {additionalRentals.map((rental, index) => (
              <TextInput
                key={index}
                label={`Mietobjekt ${index + 1}`}
                placeholder="Garten"
                mb="md"
                value={rental}
                onChange={(event) => {
                  const newRentals = [...additionalRentals];
                  newRentals[index] = event.target.value;
                  setAdditionalRentals(newRentals);
                }}
              />
            ))}

            <Button variant="outline" onClick={() => setAdditionalRentals([...additionalRentals, ''])} leftSection={<IconPlus size={14} />}>
              Mietobjekt hinzufügen
            </Button>

            <form onSubmit={handleSubmit}>
              <ButtonGroup {...{ active, setActive }} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Um welche Art von Wohnung handelt es sich?</Title>

            <Checkbox
              label="Eine öffentlich geförderte Wohnung (Sozialwohnung) oder eine sonst preisgebundene Wohnung"
              name="flatType"
              checked={data.flatType === 'Sozialwohnung'}
              onChange={(event) => setData({ ...data, flatType: 'Sozialwohnung' })}
              mb="md"
            />
            <Checkbox
              label="Eine Dienstwohnung"
              name="flatType"
              checked={data.flatType === 'Dienstwohnung'}
              onChange={(event) => setData({ ...data, flatType: 'Dienstwohnung' })}
              mb="md"
            />
            <Checkbox
              label="Eine Werkwohnung"
              name="flatType"
              checked={data.flatType === 'Werkwohnung'}
              onChange={(event) => setData({ ...data, flatType: 'Werkwohnung' })}
              mb="md"
            />
            <Checkbox
              label="Eine Eigentumswohnung"
              name="flatType"
              checked={data.flatType === 'Eigentumswohnung'}
              onChange={(event) => setData({ ...data, flatType: 'Eigentumswohnung' })}
              mb="md"
            />
            <Checkbox
              label="Eine werkgeförderte Wohnung"
              name="flatType"
              checked={data.flatType === 'werkgeförderte Wohnung'}
              onChange={(event) => setData({ ...data, flatType: 'werkgeförderte Wohnung' })}
              mb="sm"
            />
            <TextInput
              label="Sonstige"
              placeholder="Anderer Wohnungstyp"
              mb="md"
              value={['Sozialwohnung', 'Dienstwohnung', 'Werkwohnung', 'Eigentumswohnung', 'werkgeförderte Wohnung'].includes(data.flatType) ? '' : data.flatType || ''}
              onChange={(event) => setData({ ...data, flatType: event.target.value })}
            />

            <form onSubmit={handleSubmit}>
              <ButtonGroup {...{ active, setActive }} disabled={!data.flatType} />
            </form>
          </Stepper.Step>

          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Welche gemeinschaftlichen Einrichtungen und Anlagen darf der Mieter gemäß der Hausordnung mitbenutzen?</Title>

            <Checkbox
              label="Waschküche"
              checked={sharedAssets.includes('Waschküche')}
              onChange={(event) => setData({ ...data, sharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Waschküche'] : sharedAssets.filter(asset => asset !== 'Waschküche') })}
              mb="md"
            />
            <Checkbox
              label="Abstellraum/-fläche"
              checked={sharedAssets.includes('Abstellraum/-fläche')}
              onChange={(event) => setData({ ...data, sharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Abstellraum/-fläche'] : sharedAssets.filter(asset => asset !== 'Abstellraum/-fläche') })}
              mb="md"
            />
            <Checkbox
              label="Trockenboden"
              checked={sharedAssets.includes('Trockenboden')}
              onChange={(event) => setData({ ...data, sharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Trockenboden'] : sharedAssets.filter(asset => asset !== 'Trockenboden') })}
              mb="md"
            />
            <Checkbox
              label="Garten"
              checked={sharedAssets.includes('Garten')}
              onChange={(event) => setData({ ...data, sharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Garten'] : sharedAssets.filter(asset => asset !== 'Garten') })}
              mb="md"
            />
            <Checkbox
              label="Gemeinschaftsantenne"
              checked={sharedAssets.includes('Gemeinschaftsantenne')}
              onChange={(event) => setData({ ...data, sharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Gemeinschaftsantenne'] : sharedAssets.filter(asset => asset !== 'Gemeinschaftsantenne') })}
              mb="md"
            />
            <Checkbox
              label="Hofplatz"
              checked={sharedAssets.includes('Hofplatz')}
              onChange={(event) => setData({ ...data, sharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Hofplatz'] : sharedAssets.filter(asset => asset !== 'Hofplatz') })}
              mb="md"
            />
            <Checkbox
              label="Aufzug"
              checked={sharedAssets.includes('Aufzug')}
              onChange={(event) => setData({ ...data, sharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Aufzug'] : sharedAssets.filter(asset => asset !== 'Aufzug') })}
              mb="md"
            />
            <form onSubmit={handleSubmit}>
              <ButtonGroup {...{ active, setActive }} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Welche Höhe haben die monatliche Miete und die Kaution?</Title>
            <form onSubmit={handleSubmit}>
              <NumberInput
                label="Miete"
                placeholder="1200"
                required
                mb="sm"
                name="rent"
                defaultValue={data.rent}
                suffix="€"
                decimalSeparator=","
                hideControls
                decimalScale={2}
              />
              <NumberInput
                label="Kaution"
                placeholder="3600"
                required
                mb="sm"
                name="deposit"
                defaultValue={data.deposit}
                suffix="€"
                decimalSeparator=","
                hideControls
                decimalScale={2}
              />

              <TextInput
                label="Mietzahlungen Konto"
                placeholder="DE01 1234 1234 1234 1234 12"
                mb="sm"
                name="bankAccount"
                required
                defaultValue={data.bankAccount}
                error={hasIbanError && 'Iban ist ungültig'}
              />

              <ButtonGroup {...{ active, setActive }} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Wie hoch sind die Nebenkosten und auf welche Weise werden sie abgerechnet?</Title>
            <form onSubmit={handleSubmit}>
              <Box></Box> {/* hacky way to fix number input default values not being reset */}
              <NumberInput
                label="Vorauszahlungen auf die Heizkosten"
                placeholder="100"
                required
                mb="sm"
                name="heating"
                defaultValue={data.heating}
                suffix="€"
                decimalSeparator=","
                hideControls
                decimalScale={2}
              />
              <NumberInput
                label="Betriebskosten"
                placeholder="200"
                required
                mb="sm"
                name="utilities"
                defaultValue={data.utilities}
                suffix="€"
                decimalSeparator=","
                hideControls
                decimalScale={2}
              />
              <Text mb="md">Wie werden die Betriebskosten umgelegt?</Text>
              <Checkbox
                label="Vorauszahlungen (mit Abrechnung)"
                checked={data.utilitiesType === 'Prepayment'}
                onChange={(event) => setData({ ...data, utilitiesType: 'Prepayment' })}
                mb="md"
              />
              <Checkbox
                label="Pauschalen (ohne Abrechnung)"
                checked={data.utilitiesType === 'Flat'}
                onChange={(event) => setData({ ...data, utilitiesType: 'Flat' })}
                mb="md"
              />
              <ButtonGroup {...{ active, setActive }} disabled={!data.utilitiesType} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Bitte gib die folgenden Details zum Mietverhältnis an:</Title>

            <Checkbox
              label="Das Objekt wurde vom Mieter besichtigt"
              checked={data.visited || false}
              onChange={(event) => setData({ ...data, visited: event.currentTarget.checked })}
              mb="md"
            />

            <form onSubmit={handleSubmit}>
              {data.visited && <DateInput
                value={data.visitedDate}
                onChange={val => setData({ ...data, visitedDate: val })}
                label="Wann wurde das Objekt vom Mieter besichtigt?"
                placeholder="20.06.2024"
                valueFormat="DD.MM.YYYY"
                mb="md"
                required
              />}

              <DateInput
                value={data.rentStart}
                onChange={val => setData({ ...data, rentStart: val })}
                label="Wann beginnt das Mietverhältnis?"
                placeholder="01.01.2026"
                valueFormat="DD.MM.YYYY"
                required
                mb="md"
              />

              <ButtonGroup {...{ active, setActive }} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Welche Anlagen sind dem Mietvertrag beigefügt?</Title>

            <Checkbox
              label="Datenschutzerklärung (EU-DSGVO)"
              checked={enclosures.includes('DSGVO')}
              onChange={(event) => setData({ ...data, enclosures: event.currentTarget.checked ? [...enclosures, 'DSGVO'] : enclosures.filter(asset => asset !== 'DSGVO') })}
              mb="md"
            />

            <Checkbox
              label="Hausordnung"
              checked={enclosures.includes('Hausordnung')}
              onChange={(event) => setData({ ...data, enclosures: event.currentTarget.checked ? [...enclosures, 'Hausordnung'] : enclosures.filter(asset => asset !== 'Hausordnung') })}
              mb="md"
            />

            <Checkbox
              label="Informationen zum Heiz- und Lüftungsverhalten"
              checked={enclosures.includes('Lüftungsverhalten')}
              onChange={(event) => setData({ ...data, enclosures: event.currentTarget.checked ? [...enclosures, 'Lüftungsverhalten'] : enclosures.filter(asset => asset !== 'Lüftungsverhalten') })}
              mb="md"
            />

            <Checkbox
              label="Informationen zu den gesetzl. Raumtemperaturen"
              checked={enclosures.includes('Raumtemperaturen')}
              onChange={(event) => setData({ ...data, enclosures: event.currentTarget.checked ? [...enclosures, 'Raumtemperaturen'] : enclosures.filter(asset => asset !== 'Raumtemperaturen') })}
              mb="md"
            />

            <Checkbox
              label="Wohnungsübergabeprotokoll"
              checked={enclosures.includes('Wohnungsübergabeprotokoll')}
              onChange={(event) => setData({ ...data, enclosures: event.currentTarget.checked ? [...enclosures, 'Wohnungsübergabeprotokoll'] : enclosures.filter(asset => asset !== 'Wohnungsübergabeprotokoll') })}
              mb="md"
            />

            {additionalEnclosures.map((rental, index) => (
              <TextInput
                key={index}
                label={`Zusätzliche Anlage ${index + 1}`}
                placeholder="Protokoll"
                mb="md"
                value={rental}
                onChange={(event) => {
                  const newEnclousures = [...additionalEnclosures];
                  newEnclousures[index] = event.target.value;
                  setAdditionalEnclosures(newEnclousures);
                }}
              />
            ))}

            <Button variant="outline" onClick={() => setAdditionalEnclosures([...additionalEnclosures, ''])} leftSection={<IconPlus size={14} />}>
              Anlage hinzufügen
            </Button>

            <Group justify="space-between" mt="xl">
              <Button variant="default" onClick={() => setActive(active - 1)} loading={isLoading}>Zurück</Button>
              <Button type="submit" loading={isLoading} onClick={generateDocument}>Mietvertrag erstellen</Button>
            </Group>
          </Stepper.Step>
        </Stepper>
      </Card>
    </Layout >
  )
}

export default Mietvertraege
