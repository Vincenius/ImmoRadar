import { useState } from 'react';
import useSWR from 'swr'
import { Flex, Text, Group, Button, Title, Box, TextInput, Stepper, rem, Modal, Chip, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import SelectButton from '@/components/Inputs/SelectButton';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
import { mainSearches } from '@/utils/searchSeo'
import CheckboxCard from '@/components/Inputs/CheckboxCard';
import Checkbox from '@/components/Inputs/Checkbox';
import { fetcher } from '@/utils/fetcher';
// import Checkout from '@/components/Checkout/Checkout';

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

const ButtonGroup = ({ active, setActive, isLoading, hasSubmit, disabled }) => {
  return <Group justify="space-between" mt="xl">
    {active === 0 && <div></div>}
    {active > 0 && <Button variant="default" onClick={() => setActive(active - 1)} loading={isLoading}>Zurück</Button>}
    {active < 4 && <Flex gap="sm">
      {hasSubmit && <Button type="submit" loading={isLoading} disabled={disabled}>Weiter</Button>}
    </Flex>}
  </Group>
}

export default function Foerderung() {
  const [opened, { open, close }] = useDisclosure(false);
  const [active, setActive] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ TypZuschuss: true, TypKredit: true })
  const [email, setEmail] = useState('')
  const { data: subsidyData = [] } = useSWR('/api/subsidies', fetcher)

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
    (d.District === data.District || !d.District) &&
    (
      data.TypZuschuss && d.Type.includes('Zuschuss') ||
      data.TypKredit && d.Type.includes('Kredit')
    ) &&
    d.Measures?.some(element => data.Measures?.includes(element))
  )

  const handleSubmitReport = (e) => {
    e.preventDefault()
    setIsLoading(true)
    fetch('/api/subsidies', {
      method: 'POST',
      body: JSON.stringify({ data, email })
    })
      .then(() => setActive(active + 1))
      .catch(() => console.log('error')) // todo error handling
      .finally(() => setIsLoading(false))
  }

  return (
    <Layout
      title="ImmoRadar Förderung"
      description="todo"
      noindex={true} // todo
    >
      <Box className={styles.header} py="xl">
        <div className={styles.background}></div>

        <Flex mih="calc(100vh - 70px - 64px)" h="100%" direction="column" justify="space-evenly">
          <Flex gap="xl" direction="column" justify="center" align={{ base: 'center', md: 'start' }}>
            <Box p={{ base: "sm", sm: "xl", md: "0" }}>
              <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 60 }} fw="bold" mb="lg" mt={{ base: 'xl', md: 0 }} textWrap="balance">
                Der <span className={styles.gradientText}>Förder Check</span>.
              </Title>
              <Title order={2} fz={{ base: 24, xs: 32, sm: 40, md: 48 }} ta={{ base: 'center', md: 'left' }} mb="xl" fw={300}>
                Hausbau leichter finanzieren mit staatlichen Förderungen.
              </Title>
            </Box>

            <Button size="xl" onClick={open}>Förder Check Starten</Button>

            <Modal opened={opened} onClose={close} title="Förder Check" size="md" styles={{ content: { overflowX: 'hidden' } }}>
              <Stepper
                active={active}
                onStepClick={setActive}
                size="14px"
                styles={{ separator: { marginInline: 0 }, stepIcon: { color: 'transparent' } }}
                allowNextStepsSelect={false}
              >
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Handelt es sich um eine Bestandsimmobilie oder einen Neubau?</Title>

                  <Flex wrap="wrap" gap="md">
                    <SelectButton name="HouseType" value="Bestand" onClick={selectOption} fullWidth>Bestand</SelectButton>
                    <SelectButton name="HouseType" value="Neubau" onClick={selectOption} fullWidth>Neubau</SelectButton>
                  </Flex>

                  <ButtonGroup {...{ data, setData, active, setActive }} />
                </Stepper.Step>
                <Stepper.Step>
                  <form onSubmit={handleSubmitNext}>
                    <Title order={2} size="h3" mb="lg">Welche Art der Förderung suchen Sie?</Title>
                    <CheckboxCard handleChange={() => setData({ ...data, TypZuschuss: !data.TypZuschuss })} value={data.TypZuschuss} title="Zuschuss" mb="lg" />
                    <CheckboxCard handleChange={() => setData({ ...data, TypKredit: !data.TypKredit })} value={data.TypKredit} title="Kredit" />

                    <ButtonGroup {...{ data, setData, active, setActive }} hasSubmit disabled={!data.TypZuschuss && !data.TypKredit} />
                  </form>
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Wo liegt die Immobilie oder wo planen Sie zu bauen?</Title>

                  <form onSubmit={handleSubmit}>
                    <Select
                      label="Bundesland"
                      data={mainSearches.map(s => s.primary.label)}
                      required
                      mb="sm"
                      name="Region"
                      onChange={(value) => setData({ ...data, Region: value, District: null })}
                      value={data.Region}
                    />

                    <Select
                      label="Kreis/Landkreis (optional)"
                      data={districtData || []}
                      placeholder={!data.Region ? 'Zuerst Bundesland auswählen' : !districtData || !districtData.length ? 'Keine Kreise vorhanden' : 'Kreis auswählen'}
                      mb="sm"
                      name="District"
                      onChange={(value) => setData({ ...data, District: value })}
                      value={data.District}
                      disabled={!districtData || !districtData.length}
                      description="Für einige Bundesländer gibt es spezifische Förderungen einzelner Kreise/Landkreise."
                    />

                    <ButtonGroup active={active} setActive={setActive} hasSubmit disabled={!data.Region} />
                  </form>
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Welche Maßnahmen planen Sie?</Title>

                  <form onSubmit={handleSubmit}>
                    <Flex gap="sm" wrap="wrap">
                      {measuresData.map((m) => (
                        <SelectChip key={m} value={m} {...{ data, setData }}>{m}</SelectChip>
                      ))}
                    </Flex>
                    <ButtonGroup {...{ data, setData, active, setActive }} hasSubmit disabled={(data.Measures || []).length === 0}/>
                  </form>
                </Stepper.Step>
                <Stepper.Step>
                  {/* TODO keine förderungen gefunden */}
                  <Title order={2} size="h3" mb="md">
                    Wir konnten {finalData.length} Förderungen für die eingestellten Kriterien finden.
                  </Title>

                  <Text mb="md">Erhalte jetzt den vollständigen Report als PDF per E-Mail</Text>

                  <form onSubmit={handleSubmitReport}>
                    <TextInput
                      required
                      label="E-Mail Adresse"
                      placeholder="mustermann@example.com"
                      mb="md"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button fullWidth type="submit" loading={isLoading}>Report Kaufen</Button>
                  </form>
                </Stepper.Step>
                <Stepper.Completed>
                  <Title order={2} size="h3" mb="md">
                    Vielen Dank!
                  </Title>
                  <Text>
                    Der Report wurde erfolgreich erstellt und wird Dir per E-Mail zugesendet.
                  </Text>
                </Stepper.Completed>
              </Stepper>
            </Modal>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
}
