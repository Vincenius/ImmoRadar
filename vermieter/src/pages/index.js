import { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { Flex, Title, Box, Card, Text, Stepper, ThemeIcon, TextInput, Group, Button, NumberInput, Grid } from '@mantine/core'
import SelectButton from '@/components/Inputs/SelectButton'
import { IconHomeShare, IconHome, IconHomeStar } from '@tabler/icons-react'
import Checkbox from '@/components/Inputs/Checkbox'

const numberFormatElements = []

const ButtonGroup = ({ active, setActive, isLoading, disabled }) => {
  return <Group justify="space-between" mt="xl">
    {active === 0 && <div></div>}
    {active > 0 && <Button variant="default" onClick={() => setActive(active - 1)} loading={isLoading}>Zurück</Button>}
    {active < 10 && <Button type="submit" loading={isLoading} disabled={disabled}>Weiter</Button>}
  </Group>
}

function Mietvertraege() {
  const [active, setActive] = useState(0)
  const [data, setData] = useState({})
  const [additionalRooms, setAdditionalRooms] = useState([])
  const [additionalRentals, setAdditionalRentals] = useState([])

  console.log(data)

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

  const selectOption = (e) => {
    let elem = e.target
    while (!elem.name) {
      elem = elem.parentElement
    }
    setData({ ...data, [elem.name]: elem.value })
    setActive(active + 1)
  }

  const sharedAssets = data?.SharedAssets || []

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
          size="xs"
        >
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Welche Art von Mietvertrag möchtest du abschließen?</Title>

            <SelectButton name="HausTyp" value="Bungalow" onClick={selectOption} w="100%" mb="md">
              <ThemeIcon variant="white" mr="sm">
                <IconHome style={{ width: '70%', height: '70%' }} />
              </ThemeIcon>
              Wohnraummietvertrag
            </SelectButton>
            <SelectButton name="HausTyp" value="Bungalow" onClick={selectOption} w="100%" mb="md">
              <ThemeIcon variant="white" mr="sm">
                <IconHomeShare style={{ width: '70%', height: '70%' }} />
              </ThemeIcon>
              Staffel-Wohnraummietvertrag
            </SelectButton>
            <SelectButton name="HausTyp" value="Bungalow" onClick={selectOption} w="100%" mb="md">
              <ThemeIcon variant="white" mr="sm">
                <IconHomeStar style={{ width: '70%', height: '70%' }} />
              </ThemeIcon>
              Index-Wohnraummietvertrag
            </SelectButton>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Wie lauten die vollständigen Angaben für Vermieter und Mieter?</Title>

            <form onSubmit={handleSubmit}>
              <Flex gap="md" justify="space-between">
                <Box w="100%">
                  <Text fw="bold" mb="sm">Vermieter</Text>
                  <TextInput
                    label="Name"
                    placeholder="Max Mustermann"
                    required
                    mb="sm"
                    name="LandlordName"
                    defaultValue={data.LandlordName}
                  />
                  <TextInput
                    label="Wohnhaft in"
                    placeholder="Beispielstr. 12, 12345 Musterstadt"
                    required
                    mb="sm"
                    name="LandlordAddress"
                    defaultValue={data.LandlordAddress}
                  />
                  <TextInput
                    label="Vertreten durch (optional)"
                    placeholder="Fertighaus Radar Property GmbH"
                    mb="sm"
                    name="LandlordRepresentedBy"
                    defaultValue={data.LandlordRepresentedBy}
                  />
                </Box>
                <Box w="100%">
                  <Text fw="bold" mb="sm">Mieter</Text>
                  <TextInput
                    label="Name"
                    placeholder="Max Mustermann, Erika Mustermann"
                    required
                    mb="sm"
                    name="TenantName"
                    defaultValue={data.TenantName}
                  />
                  <TextInput
                    label="Wohnhaft in"
                    placeholder="Beispielstr. 12, 12345 Musterstadt"
                    required
                    mb="sm"
                    name="TenantAddress"
                    defaultValue={data.TenantAddress}
                  />
                </Box>
              </Flex>

              <ButtonGroup {...{ active, setActive }} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Wo befindet sie sich die Mietsache?</Title>
            <form onSubmit={handleSubmit}>
              <TextInput
                label="Wohnhaft in"
                placeholder="Beispielstr. 12, 12345 Musterstadt"
                required
                mb="sm"
                name="Address"
                defaultValue={data.Address}
              />
              <TextInput
                label="Geschoss (optional)"
                placeholder="3"
                mb="sm"
                name="Level"
                defaultValue={data.Level}
              />
              <TextInput
                label="Lage im Gebäude (optional)"
                placeholder="rechts/links/Mitte; Nr. 3 des Geschossplans)"
                mb="sm"
                name="Location"
                defaultValue={data.Location}
              />
              <ButtonGroup {...{ active, setActive }} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Welche Räume umfasst die Mietsache?</Title>
            <form onSubmit={handleSubmit}>
              <Grid>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Zimmer"
                    placeholder="2"
                    required
                    mb="sm"
                    name="Rooms"
                    defaultValue={data.Rooms}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="WC"
                    placeholder="0"
                    mb="sm"
                    name="WC"
                    defaultValue={data.WC}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Küche/Kochnische"
                    placeholder="0"
                    mb="sm"
                    name="Kitchen"
                    defaultValue={data.Kitchen}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Flur"
                    placeholder="0"
                    mb="sm"
                    name="Hall"
                    defaultValue={data.Hall}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Bad"
                    placeholder="0"
                    mb="sm"
                    name="Bathroom"
                    defaultValue={data.Bathroom}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Diele"
                    placeholder="0"
                    mb="sm"
                    name="Hallway"
                    defaultValue={data.Hallway}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Dusche"
                    placeholder="0"
                    mb="sm"
                    name="Shower"
                    defaultValue={data.Shower}
                  />
                </Grid.Col>
                {additionalRooms.map((room, index) => (
                  <Grid.Col span={4} key={index}>
                    <Flex gap="sm">
                      <NumberInput
                        w="33%"
                        label="Anzahl"
                        placeholder="2"
                        mb="sm"
                        value={room.count}
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
                <Grid.Col span={4}>
                  <Button mt="1.7em" mb="sm" fullWidth variant="outline" onClick={() => setAdditionalRooms([...additionalRooms, { name: '', count: '' }])}>
                    +
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
              name="Garage"
              checked={data.Garage}
              onChange={(event) => setData({ ...data, Garage: event.currentTarget.checked })}
              mb="md"
            />
            <Checkbox
              label="Stellplatz"
              name="Carport"
              checked={data.Carport}
              onChange={(event) => setData({ ...data, Carport: event.currentTarget.checked })}
              mb={data.Carport ? "xs" : "md"}
            />
            {data.Carport && (
              <TextInput
                label="Stellplatz Nr."
                placeholder="1"
                mb="md"
                name="CarportNumber"
                defaultValue={data.CarportNumber}
              />
            )}
            <Checkbox
              label="nach besonderem Garagen-/Stellplatz-Mietvertrag"
              name="GarageContract"
              checked={data.GarageContract}
              onChange={(event) => setData({ ...data, GarageContract: event.currentTarget.checked })}
              mb="md"
            />
            <Checkbox
              label="Die genaue Beschreibung der überlassenen Mietsache des Zubehörs ist in der Wohnungsbeschreibung und Übergabeverhandlung enthalten, die diesen Vertrag ergänzt."
              name="AdditionalContract"
              checked={data.AdditionalContract}
              onChange={(event) => setData({ ...data, AdditionalContract: event.currentTarget.checked })}
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

            <Button fullWidth variant="outline" onClick={() => setAdditionalRentals([...additionalRentals, ''])}>
              +
            </Button>

            <form onSubmit={handleSubmit}>
              <ButtonGroup {...{ active, setActive }} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Um welche Art von Wohnung handelt es sich?</Title>

            <Checkbox
              label="Eine öffentlich geförderte Wohnung (Sozialwohnung) oder eine sonst preisgebundene Wohnung"
              name="FlatType"
              checked={data.FlatType === 'Sozialwohnung'}
              onChange={(event) => setData({ ...data, FlatType: 'Sozialwohnung' })}
              mb="md"
            />
            <Checkbox
              label="Eine Dienstwohnung"
              name="FlatType"
              checked={data.FlatType === 'Dienstwohnung'}
              onChange={(event) => setData({ ...data, FlatType: 'Dienstwohnung' })}
              mb="md"
            />
            <Checkbox
              label="Eine Werkwohnung"
              name="FlatType"
              checked={data.FlatType === 'Werkwohnung'}
              onChange={(event) => setData({ ...data, FlatType: 'Werkwohnung' })}
              mb="md"
            />
            <Checkbox
              label="Eine Eigentumswohnung"
              name="FlatType"
              checked={data.FlatType === 'Eigentumswohnung'}
              onChange={(event) => setData({ ...data, FlatType: 'Eigentumswohnung' })}
              mb="md"
            />
            <Checkbox
              label="Eine werkgeförderte Wohnung"
              name="FlatType"
              checked={data.FlatType === 'werkgeförderte Wohnung'}
              onChange={(event) => setData({ ...data, FlatType: 'werkgeförderte Wohnung' })}
              mb="sm"
            />
            <TextInput
              label="Sonstige"
              placeholder="Anderer Wohnungstyp"
              mb="md"
              value={['Sozialwohnung', 'Dienstwohnung', 'Werkwohnung', 'Eigentumswohnung', 'werkgeförderte Wohnung'].includes(data.FlatType) ? '' : data.FlatType}
              onChange={(event) => setData({ ...data, FlatType: event.target.value })}
            />

            <form onSubmit={handleSubmit}>
              <ButtonGroup {...{ active, setActive }} disabled={!data.FlatType} />
            </form>
          </Stepper.Step>

          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Welche gemeinschaftlichen Einrichtungen und Anlagen darf der Mieter gemäß der Hausordnung mitbenutzen?</Title>

            <Checkbox
              label="Waschküche"
              name="SharedAssets"
              checked={sharedAssets.includes('Waschküche')}
              onChange={(event) => setData({ ...data, SharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Waschküche'] : sharedAssets.filter(asset => asset !== 'Waschküche') })}
              mb="md"
            />
            <Checkbox
              label="Abstellraum/-fläche"
              name="SharedAssets"
              checked={sharedAssets.includes('Abstellraum/-fläche')}
              onChange={(event) => setData({ ...data, SharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Abstellraum/-fläche'] : sharedAssets.filter(asset => asset !== 'Abstellraum/-fläche') })}
              mb="md"
            />
            <Checkbox
              label="Trockenboden"
              name="SharedAssets"
              checked={sharedAssets.includes('Trockenboden')}
              onChange={(event) => setData({ ...data, SharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Trockenboden'] : sharedAssets.filter(asset => asset !== 'Trockenboden') })}
              mb="md"
            />
            <Checkbox
              label="Garten"
              name="SharedAssets"
              checked={sharedAssets.includes('Garten')}
              onChange={(event) => setData({ ...data, SharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Garten'] : sharedAssets.filter(asset => asset !== 'Garten') })}
              mb="md"
            />
            <Checkbox
              label="Gemeinschaftsantenne"
              name="SharedAssets"
              checked={sharedAssets.includes('Gemeinschaftsantenne')}
              onChange={(event) => setData({ ...data, SharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Gemeinschaftsantenne'] : sharedAssets.filter(asset => asset !== 'Gemeinschaftsantenne') })}
              mb="md"
            />
            <Checkbox
              label="Hofplatz"
              name="SharedAssets"
              checked={sharedAssets.includes('Hofplatz')}
              onChange={(event) => setData({ ...data, SharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Hofplatz'] : sharedAssets.filter(asset => asset !== 'Hofplatz') })}
              mb="md"
            />
            <Checkbox
              label="Aufzug"
              name="SharedAssets"
              checked={sharedAssets.includes('Aufzug')}
              onChange={(event) => setData({ ...data, SharedAssets: event.currentTarget.checked ? [...sharedAssets, 'Aufzug'] : sharedAssets.filter(asset => asset !== 'Aufzug') })}
              mb="md"
            />
            <form onSubmit={handleSubmit}>
              <ButtonGroup {...{ active, setActive }} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            <Title order={2} size="h3" mb="lg">Welche Höhe haben die monatliche Miete, und die Kaution?</Title>
            <form onSubmit={handleSubmit}>
              <NumberInput
                label="Miete"
                placeholder="1200"
                required
                mb="sm"
                name="Rent"
                defaultValue={data.Rent}
                suffix="€"
              />
              <NumberInput
                label="Kaution"
                placeholder="3600"
                required
                mb="sm"
                name="Deposit"
                defaultValue={data.Deposit}
                suffix="€"
              />

              <TextInput
                label="Mietzahlungen Konto"
                placeholder="DE01 1234 1234 1234 1234 12"
                mb="sm"
                name="BankAccount"
                required
                defaultValue={data.BankAccount}
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
                name="Heating"
                defaultValue={data.Heating}
                suffix="€"
              />
              <NumberInput
                label="Betriebskosten"
                placeholder="200"
                required
                mb="sm"
                name="Utilities"
                defaultValue={data.Utilities}
                suffix="€"
              />
              <Text mb="md">Wie werden die Betriebskosten umgelegt?</Text>
              <Checkbox
                label="Vorauszahlungen (mit Abrechnung)"
                checked={data.UtilitiesType === 'Prepayment'}
                onChange={(event) => setData({ ...data, UtilitiesType: 'Prepayment' })}
                mb="md"
              />
              <Checkbox
                label="Pauschalen (ohne Abrechnung) "
                checked={data.UtilitiesType === 'Flat'}
                onChange={(event) => setData({ ...data, UtilitiesType: 'Flat' })}
                mb="md"
              />
              <ButtonGroup {...{ active, setActive }} disabled={!data.UtilitiesType} />
            </form>
          </Stepper.Step>
          <Stepper.Step>
            {/* <Title order={2} size="h3" mb="lg">Wurde das Objekt vom Mieter besichtigt und falls ja wann?</Title> */}
            {/* Weitere infos */}
            {/* Wurde das Objekt vom Mieter besichtigt */}
            {/* wann */}
            {/* Mietdauer */}
            {/* Bagatellenschäden */}
          </Stepper.Step>
          <Stepper.Step>
            {/* Zusätzliche vereinbarungen und Anlagen */}
          </Stepper.Step>
        </Stepper>
      </Card>
    </Layout >
  )
}

export default Mietvertraege
