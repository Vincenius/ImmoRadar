import { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { Flex, Title, Box, Card, Text, Stepper, ThemeIcon, TextInput, Group, Button, NumberInput, Grid, List } from '@mantine/core'
import SelectButton from '@/components/Inputs/SelectButton'
import { IconHome, IconPlus } from '@tabler/icons-react'
import Checkbox from '@/components/Inputs/Checkbox'
import { DateInput } from '@mantine/dates'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import IBAN from 'iban'
import 'dayjs/locale/de';
import { mockData } from '@/utils/mockData'
import Link from 'next/link'
import Pricing from '@/components/Pricing/Pricing'
import Checkout from '@/components/Checkout/Checkout'

dayjs.extend(customParseFormat)
dayjs.locale('de');

const numberFormatElements = []

const ButtonGroup = ({ active, setActive, disabled }) => {
  return <Group justify="space-between" mt="xl">
    {active === 0 && <div></div>}
    {active > 0 && <Button variant="default" onClick={() => setActive(active - 1)}>Zurück</Button>}
    <Button type="submit" disabled={disabled}>Weiter</Button>
  </Group>
}

function Mietvertraege() {
  const [active, setActive] = useState(11) // TODO REVERT!!!
  const [data, setData] = useState(mockData) // { visited: true, rooms: {}, rentals: {} } // TODO add user session data (if logged in)
  const [additionalRooms, setAdditionalRooms] = useState([])
  const [additionalRentals, setAdditionalRentals] = useState([])
  const [additionalEnclosures, setAdditionalEnclosures] = useState([])
  const [rentSteps, setRentSteps] = useState([{}])
  const [isLoading, setIsLoading] = useState(false)
  const [hasIbanError, setHasIbanError] = useState(false)
  const [resultId, setResultId] = useState('67dbbeff7c0bb6c8d7c6cb30') // TODO remove
  const [checkoutVariant, setCheckoutVariant] = useState()

  console.log(resultId)

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
      rentSteps: rentSteps.filter(r => r.date && r.rent),
    }

    fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userData }),
    }).then(res => res.json())
      .then(async res => {
        setResultId(res.insertedId)
        // const response = await fetch(`/api/download?id=${res.insertedId}`);
        // const blob = await response.blob();
        // const url = window.URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', 'Mietvertrag.pdf');
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
        setActive(active + 1)
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
      <Title mb="xl" fw="lighter" size="3em">Mietvertrag Generator</Title>

      <Card withBorder shadow="md">
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
          size="14px"
          styles={{ separator: { marginInline: 0 }, stepIcon: { color: 'transparent' } }}
        >
          <Stepper.Step>
            <Title order={2} size="h3" mb="xl" mt="md" ta="center">Welche Art von Mietvertrag möchtest du abschließen?</Title>

            <SelectButton name="contract" value="Wohnraum" onClick={selectOption} w="100%" mb="md" isMultiLine={true}>
              <Flex gap="sm" align="center">
                <ThemeIcon variant="white">
                  <IconHome style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
                <Text size="xl" fw="500">Wohnraum<wbr />mietvertrag</Text>
              </Flex>
            </SelectButton>

            <SelectButton name="contract" value="Staffel" onClick={selectOption} w="100%" mb="md" isMultiLine={true}>
              <Flex gap="sm" align="center">
                <ThemeIcon variant="white">
                  <IconHome style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
                <Text size="xl" fw="500">Staffel-Wohnraum<wbr />mietvertrag</Text>
              </Flex>
            </SelectButton>

            <SelectButton name="contract" value="Index" onClick={selectOption} w="100%" mb="md" isMultiLine={true}>
              <Flex gap="sm" align="center">
                <ThemeIcon variant="white">
                  <IconHome style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
                <Text size="xl" fw="500">Index-Wohnraum<wbr />mietvertrag</Text>
              </Flex>
            </SelectButton>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="xl" mt="md" ta="center">Wie lauten die vollständigen Angaben für Vermieter und Mieter?</Title>

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
            <Title order={2} size="h3" mb="xl" mt="md" ta="center">Wo befindet sich die Mietsache?</Title>
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
            <Title order={2} size="h3" mb="xl" mt="md" ta="center">Welche Räume umfasst die Mietsache?</Title>
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
            <Title order={2} size="h3" mb="xl" mt="md" ta="center">Was wird zusätzlich Mitvermietet?</Title>

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
            <Title order={2} size="h3" mb="xl" mt="md" ta="center">Um welche Art von Wohnung handelt es sich?</Title>

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
            <Title order={2} size="h3" mb="xl" mt="md" ta="center">Welche gemeinschaftlichen Einrichtungen und Anlagen darf der Mieter gemäß der Hausordnung mitbenutzen?</Title>

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
          {data.contract === 'Staffel' && <Stepper.Step>
            <Title order={2} size="h3" mb="xl" mt="md" ta="center">Welche Höhe hat die monatliche Miete?</Title>

            <form onSubmit={handleSubmit}>
              <NumberInput
                label="Miete zu Beginn des Mietverhältnisses "
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

              {rentSteps.map((step, index) => <>
                <Text>{index + 1}. Mieterhöhung</Text>
                <Flex mb="md" gap="md" align="flex-end">
                  <DateInput
                    value={step.date}
                    onChange={val => setRentSteps(
                      rentSteps.map((s, i) =>
                        i === index ? { ...s, date: val } : s
                      )
                    )}
                    label="Datum der Mieterhöhung"
                    placeholder="20.06.2024"
                    valueFormat="DD.MM.YYYY"
                    w="100%"
                    locale="de"
                  />
                  <NumberInput
                    label="Neue Miete"
                    placeholder="1220€"
                    value={step.rent || ''}
                    onChange={val => setRentSteps(
                      rentSteps.map((s, i) =>
                        i === index ? { ...s, rent: val } : s
                      )
                    )}
                    suffix="€"
                    decimalSeparator=","
                    hideControls
                    decimalScale={2}
                    w="100%"
                  />
                </Flex>
              </>)}

              <Button variant="outline" onClick={() => setRentSteps([...rentSteps, {}])} leftSection={<IconPlus size={14} />}>
                Mieterhöhung hinzufügen
              </Button>

              <ButtonGroup {...{ active, setActive }} />
            </form>

          </Stepper.Step>}
          <Stepper.Step>
            {data.contract !== 'Staffel' && <Title order={2} size="h3" mb="xl" mt="md" ta="center">Welche Höhe haben die monatliche Miete und die Kaution?</Title>}
            {data.contract === 'Staffel' && <Title order={2} size="h3" mb="xl" mt="md" ta="center">Wie hoch ist die Kaution und auf welches Konto sollen die Miete und die Kaution überwiesen werden?</Title>}
            <form onSubmit={handleSubmit}>
              {data.contract !== "Staffel" && <NumberInput
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
              />}
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
            <Title order={2} size="h3" mb="xl" mt="md" ta="center">Wie hoch sind die Nebenkosten und auf welche Weise werden sie abgerechnet?</Title>
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
            <Title order={2} size="h3" mb="xl" mt="md" ta="center">Bitte gib die folgenden Details zum Mietverhältnis an:</Title>

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
                locale="de"
              />}

              <DateInput
                value={data.rentStart}
                onChange={val => setData({ ...data, rentStart: val })}
                label="Wann beginnt das Mietverhältnis?"
                placeholder="01.01.2026"
                valueFormat="DD.MM.YYYY"
                required
                mb="md"
                locale="de"
              />

              <ButtonGroup {...{ active, setActive }} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="xl" mt="md" ta="center">Welche Anlagen sind dem Mietvertrag beigefügt?</Title>

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

          <Stepper.Completed>
            { !checkoutVariant && <>
              {/* TODO Check if logged in mit jahresabo */}
              <Title order={2} size="h3" mb="xl" mt="md" ta="center">Dein Mietvertrag ist fertig – Wähle dein Zahlungsmodell</Title>

              <Pricing
                cta1={<Button fullWidth variant="outline" onClick={() => setCheckoutVariant('single')}>Jetzt kaufen</Button>}
                cta2={<Button fullWidth onClick={() => setCheckoutVariant('yearly')}>Jetzt abonnieren</Button>}
              />
            </> }
            
            { checkoutVariant && <Box my="lg">
              
              <Checkout variant={checkoutVariant} id={resultId} />
            </Box> }

            {/* vorschau */}
            {/* <Box maw="600px" m="0 auto">
              <Title order={2} size="h3" mb="xl" mt="md" ta="center">Der Mietvertrag wurde erfolgreich erstellt!</Title>
              <Text mb="md">Vielen Dank, dass du unseren Mietvertrag-Generator genutzt hast!</Text>
              <Text mb="xl">Falls der Download nicht automatisch gestartet ist, kannst du den Mietvertrag über den folgenden Link erneut herunterladen:</Text>
              <Text mb="xl" ta="center">
                <Button href={`/api/download?id=${resultId}`} component="a" target="_blank">Mietvertrag herunterladen</Button>
              </Text>
              <Text mb="xl">Erstelle jetzt einen Account, um deine Daten zu speichern und Mietverträge unkompliziert zu verwalten.</Text>
            </Box>
            <Button variant="default" onClick={() => setActive(active - 1)} loading={isLoading}>Zurück</Button> */}
          </Stepper.Completed>
        </Stepper>
      </Card>
    </Layout >
  )
}

export default Mietvertraege
