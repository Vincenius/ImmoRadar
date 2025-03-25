import { Card, Flex, TextInput, NumberInput, Title, Grid, Button, Text } from '@mantine/core'
import Checkbox from '@/components/Inputs/Checkbox'
import { IconPlus } from '@tabler/icons-react'
import React, { useState } from 'react'
import { useRouter } from 'next/router'

function EstateForm({ defaultData = {} }) {
  const {
    additionalRooms: defaultAdditionalRooms = [],
    additionalRentals: defaultAdditionalRentals = [],
    rentSteps: defaultRentSteps = [{}],
    ...rest
  } = defaultData
  const initData = rest._id ? rest : { rooms: {}, rentals: [] }
  const router = useRouter()
  const isEdit = defaultData._id
  const [data, setData] = useState(initData)
  const [additionalRooms, setAdditionalRooms] = useState(defaultAdditionalRooms)
  const [additionalRentals, setAdditionalRentals] = useState(defaultAdditionalRentals)
  const [requiredError, setRequiredError] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const sharedAssets = data?.sharedAssets || []
  const rentals = data?.rentals || []

  const handleSubmit = e => {
    e.preventDefault()
    setRequiredError(false)
    setIsLoading(true)

    if (!data.flatType) {
      setRequiredError('flatType')
      setIsLoading(false)
      return
    }

    const formObject = {};
    const elements = e.target.elements;
    for (let element of elements) {
      if (element.name) {
        formObject[element.name] = element.value;
      }
    }

    const newData = {
      ...data,
      ...formObject,
      additionalRooms,
      additionalRentals,
    }

    fetch('/api/estates', {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(newData)
    }).then(res => res.json())
      .then(() => {
        const param = isEdit ? 'edit' : 'new'
        router.push(`/app/immobilien?success=${param}`)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card withBorder shadow="md" mb="md">
        <Title order={2} size="h3" mb="xl" mt="md" ta="center">Wo befindet sich die Immobilie?</Title>
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
          defaultValue={data.level}
        />
        <TextInput
          label="Lage im Gebäude (optional)"
          placeholder="rechts/links/Mitte; Nr. 3 des Geschossplans)"
          mb="sm"
          name="location"
          defaultValue={data.location}
        />
      </Card>

      <Card withBorder shadow="md" mb="md">
        <Title order={2} size="h3" mb="xl" mt="md" ta="center">Welche Räume umfasst die Immobilie?</Title>
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
      </Card>

      <Card withBorder shadow="md" mb="md">
        <Title order={2} size="h3" mb="xl" mt="md" ta="center">Was wird zusätzlich Mitvermietet?</Title>

        <Checkbox
          label="Garage"
          checked={data.rentals.includes('garage')}
          onChange={(event) => setData({ ...data, rentals: event.currentTarget.checked ? [...rentals, 'garage'] : rentals.filter(r => r !== 'garage') })}
          mb="md"
        />
        <Checkbox
          label="Stellplatz"
          checked={data.rentals.includes('carport')}
          onChange={(event) => setData({ ...data, rentals: event.currentTarget.checked ? [...rentals, 'carport'] : rentals.filter(r => r !== 'carport') })}
          mb={data.carport ? "xs" : "md"}
        />
        {data.rentals.includes('carport') && (
          <TextInput
            label="Stellplatz Nr."
            placeholder="1"
            mb="md"
            value={data.carportNumber || ''}
            onChange={(event) => setData({ ...data, carportNumber: event.target.value })}
          />
        )}
        <Checkbox
          label="nach besonderem Garagen-/Stellplatz-Mietvertrag"
          checked={data.rentals.includes('garageContract')}
          onChange={(event) => setData({ ...data, rentals: event.currentTarget.checked ? [...rentals, 'garageContract'] : rentals.filter(r => r !== 'garageContract') })}
          mb="md"
        />
        <Checkbox
          label="Die genaue Beschreibung der überlassenen Mietsache des Zubehörs ist in der Wohnungsbeschreibung und Übergabeverhandlung enthalten, die diesen Vertrag ergänzt."
          checked={data.rentals.includes('additionalContract')}
          onChange={(event) => setData({ ...data, rentals: event.currentTarget.checked ? [...rentals, 'additionalContract'] : rentals.filter(r => r !== 'additionalContract') })}
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
      </Card>

      <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
        <Card withBorder shadow="md" mb="md" w="100%">
          <Title order={2} size="h3" mb="xl" mt="md" ta="center">Um welche Art von Wohnung handelt es sich?</Title>

          <Checkbox
            label="Eine öffentlich geförderte Wohnung (Sozialwohnung) oder eine sonst preisgebundene Wohnung"
            checked={data.flatType === 'Sozialwohnung'}
            onChange={(event) => setData({ ...data, flatType: 'Sozialwohnung' })}
            mb="md"
          />
          <Checkbox
            label="Eine Dienstwohnung"
            checked={data.flatType === 'Dienstwohnung'}
            onChange={(event) => setData({ ...data, flatType: 'Dienstwohnung' })}
            mb="md"
          />
          <Checkbox
            label="Eine Werkwohnung"
            checked={data.flatType === 'Werkwohnung'}
            onChange={(event) => setData({ ...data, flatType: 'Werkwohnung' })}
            mb="md"
          />
          <Checkbox
            label="Eine Eigentumswohnung"
            checked={data.flatType === 'Eigentumswohnung'}
            onChange={(event) => setData({ ...data, flatType: 'Eigentumswohnung' })}
            mb="md"
          />
          <Checkbox
            label="Eine werkgeförderte Wohnung"
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

          {requiredError === 'flatType' && <Text mt="md" c="red">Dieses Feld muss ausgefüllt werden.</Text>}
        </Card>

        <Card withBorder shadow="md" mb="md" w="100%">
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
        </Card>
      </Flex>

      <Button mt="lg" fullWidth size="lg" type="submit" loading={isLoading}>{isEdit ? 'Immobilie aktualisieren' : 'Immobilie erstellen'}</Button>
    </form>
  )
}

export default EstateForm
