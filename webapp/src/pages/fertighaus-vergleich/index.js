import { useState } from 'react';
import { Flex, Group, Button, Title, Box, Stepper, Modal, RangeSlider, Grid, Chip } from '@mantine/core';
import SelectButton from '@/components/Inputs/SelectButton';
import Checkbox from '@/components/Inputs/Checkbox';
import { useDisclosure } from '@mantine/hooks';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
// import Checkout from '@/components/Checkout/Checkout';

const numberFormatElements = ['Radius', 'MinSize', 'MaxSize', 'Budget', 'Postalcode']

const SelectChip = ({ children, data, setData, value, ...props }) => {
  const handleChange = () => {
    setData({
      ...data,
      Merkmale: data['Merkmale']?.includes(value)
        ? data['Merkmale']?.filter((m) => m !== value)
        : [...(data['Merkmale'] || []), value]
      })
  }
  return (
    <Chip
      size="lg"
      variant="outline"
      styles={{ root: { flexGrow: 1 }, label: { width: '100%', justifyContent: 'center' } }}
      checked={data['Merkmale']?.includes(value)}
      onChange={handleChange}
      {...props}
    >
      {children}
    </Chip>
  )
}

const ButtonGroup = ({ active, setActive, data, setData, formValues, isLoading, hasSubmit, hideSkip }) => {
  const handleSkip = () => {
    setActive(active + 1)
    let newData = data
    // remove data if skipped
    for (const formValue of formValues) {
      const { [formValue]: _, ...updatedData } = (newData || {})
      newData = updatedData
    }
    setData(newData || {})
  }

  return <Group justify="space-between" mt="xl">
    { active === 0 && <div></div>}
    { active > 0 && <Button variant="default" onClick={() => setActive(active - 1)} loading={isLoading}>Zurück</Button> }
    { active < 10 && <Flex gap="sm">
      { !hideSkip && <Button onClick={handleSkip} variant="light">Frage überspringen</Button> }
      { hasSubmit && <Button type="submit" loading={isLoading}>Weiter</Button> }
    </Flex> }
  </Group>
}

export default function HausanbieterVergleich() {
  const [opened, { open, close }] = useDisclosure(false);
  const [active, setActive] = useState(0);
  const [data, setData] = useState({ GrundstueckVorhanden: true })

  const selectOption = (e) => {
    let elem = e.target
    while (!elem.name) {
      elem = elem.parentElement
    }
    setData({ ...data, [elem.name]: elem.value })
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

  return (
    <Layout
      title="ImmoRadar Hausanbieter Vergleich"
      description="todo"
      noindex={true}
    >
      <Box className={styles.header} py="xl">
        <div className={styles.background}></div>

        <Flex mih="calc(100vh - 70px - 64px)" h="100%" direction="column" justify="space-evenly">
          <Flex gap="xl" direction="column" justify="center" align={{ base: 'center', md: 'start' }}>
            <Box p={{ base: "sm", sm: "xl", md: "0" }}>
              <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 60 }} fw="bold" mb="lg" mt={{ base: 'xl', md: 0 }} textWrap="balance">
                Der <span className={styles.gradientText}>Fertighausanbieter Vergleich</span>.
              </Title>
              <Title order={2} fz={{ base: 24, xs: 32, sm: 40, md: 48 }} ta={{ base: 'center', md: 'left' }} mb="xl" fw={300}>
                Nutze unser Tool und spare dir die Stundenlange Recherche.
              </Title>
            </Box>

            <Button size="xl" onClick={open}>Fertighausanbieter Vergleich Starten</Button>

            <Modal opened={opened} onClose={close} title="Hausanbieter Vergleich" size="md" styles={{ content: { overflowX: 'hidden' } }}>
              <Stepper
                active={active}
                onStepClick={setActive}
                size="14px"
                styles={{ separator: { marginInline: 0 }, stepIcon: { color: 'transparent' }}}
                allowNextStepsSelect={false}
              >
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Welcher Haustyp soll erworben werden?</Title>

                  <Flex wrap="wrap" gap="md">
                    <SelectButton name="HausTyp" value="Bungalow" onClick={selectOption}>Bungalow</SelectButton>
                    <SelectButton name="HausTyp" value="EFH" onClick={selectOption}>EFH</SelectButton>
                    <SelectButton name="HausTyp" value="EFH-Einliger" onClick={selectOption}>EFH-Einliger Wohnung</SelectButton>
                    <SelectButton name="HausTyp" value="Doppelhaus" onClick={selectOption}>Doppelhaus</SelectButton>
                    <SelectButton name="HausTyp" value="Mehrfamilienhaus" onClick={selectOption}>Mehrfamilienhaus</SelectButton>
                  </Flex>

                  <ButtonGroup formValues={["HausTyp"]} {...{ data, setData, active, setActive }} />
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Wie viele Geschosse sollen gebaut werden?</Title>
                  <Flex wrap="wrap" gap="md">
                    <SelectButton name="Geschosse" value="1" onClick={selectOption}>1 Geschoss</SelectButton>
                    <SelectButton name="Geschosse" value="1,5" onClick={selectOption}>1,5 Geschosse</SelectButton>
                    <SelectButton name="Geschosse" value="2" onClick={selectOption}>2 Geschosse</SelectButton>
                    <SelectButton name="Geschosse" value="2,5" onClick={selectOption}>2,5 Geschosse</SelectButton>
                    <SelectButton name="Geschosse" value=">2,5" onClick={selectOption}>Mehr als 2,5 Geschosse</SelectButton>
                  </Flex>

                  <ButtonGroup formValues={["Geschosse"]} {...{ data, setData, active, setActive }} />
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Welche Dachform soll erstellt werden?</Title>
                  <Flex wrap="wrap" gap="md">
                    <SelectButton name="Dachform" value="Flachdach" onClick={selectOption}>Flachdach</SelectButton>
                    <SelectButton name="Dachform" value="Satteldach" onClick={selectOption}>Satteldach</SelectButton>
                    <SelectButton name="Dachform" value="Pultdach" onClick={selectOption}>Pultdach</SelectButton>
                    <SelectButton name="Dachform" value="Walmdach" onClick={selectOption}>Walmdach</SelectButton>
                    <SelectButton name="Dachform" value="Sonstige" onClick={selectOption}>Sonstige</SelectButton>
                  </Flex>

                  <ButtonGroup formValues={["Dachform"]} {...{ data, setData, active, setActive }} />
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Welche Hausart wird bevorzugt?</Title>
                  <SelectButton isMultiLine={true} mb="md" name="Hausart" value="Architektenhaus" onClick={selectOption}>
                    Freigeplantes Architektenhaus mit Änderungesmöglichkeiten
                  </SelectButton>

                  <SelectButton isMultiLine={true} mb="md" name="Hausart" value="VorgeplantesHaus" onClick={selectOption}>
                    Vorgeplantes Haus mit teilweise der Möglichkeit von Änderungen
                  </SelectButton>

                  <SelectButton isMultiLine={true} mb="md" name="Hausart" value="Typenhaus" onClick={selectOption}>
                    Typenhaus nur geringfügige Änderungen möglich
                  </SelectButton>

                  <ButtonGroup formValues={["Hausart"]} {...{ data, setData, active, setActive }} />
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Welche Ausbauart wird bevorzugt?</Title>
                  <SelectButton isMultiLine={true} mb="md" name="Ausbauart" value="Basishaus" onClick={selectOption}>
                    Basishaus nur Gebäudehülle zum Selbstausbau
                  </SelectButton>

                  <SelectButton isMultiLine={true} mb="md" name="Ausbauart" value="Technikfertig" onClick={selectOption}>
                    Basishaus + Technikfertig (Oberflächen können selbst gestaltet werden)
                  </SelectButton>

                  <SelectButton isMultiLine={true} fullWidth mb="md" name="Ausbauart" value="Bezugsfertig" onClick={selectOption}>
                    Bezugsfertig komplett
                  </SelectButton>

                  <ButtonGroup formValues={["Ausbauart"]} {...{ data, setData, active, setActive }} />
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Welche Hausgröße in m²?</Title>

                  <form onSubmit={handleSubmit}>
                    <RangeSlider
                      size="xl"
                      mt="xl"
                      mb="xl"
                      defaultValue={[
                        data.Groesse_from ? parseInt(data.Groesse_from) : 75,
                        data.Groesse_to ? parseInt(data.Groesse_to) : 150]}
                      min={50}
                      max={500}
                      step={1}
                      label={(value) => `${value}m²`}
                      labelAlwaysOn
                      name="Groesse"
                    />

                    <ButtonGroup formValues={["Groesse_from", "Groesse_to"]} hasSubmit={true} {...{ data, setData, active, setActive }} />
                  </form>
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Ausstattungsqualität?</Title>
                  <Flex gap="md" wrap="wrap">
                    <SelectButton name="Ausstattung" value="Standard" onClick={selectOption}>Standard</SelectButton>
                    <SelectButton name="Ausstattung" value="Gehoben" onClick={selectOption}>Gehoben</SelectButton>
                    <SelectButton name="Ausstattung" value="Exklusiv" onClick={selectOption}>Exklusiv</SelectButton>
                    <SelectButton name="Ausstattung" value="Luxus" onClick={selectOption}>Luxus</SelectButton>
                  </Flex>

                  <ButtonGroup formValues={["Ausstattung"]} {...{ data, setData, active, setActive }} />
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Was ist Dir zudem wichtig?</Title>
                  <form onSubmit={handleSubmit}>
                    <Flex gap="sm" wrap="wrap">
                      <SelectChip value="KFW40" {...{ data, setData } }>KFW 40</SelectChip>
                      <SelectChip value="Fussbodenheizung" {...{ data, setData } }>Fußbodenheizung</SelectChip>
                      <SelectChip value="Kamin" {...{ data, setData } }>Kamin</SelectChip>
                      <SelectChip value="Ofen" {...{ data, setData } }>Ofen</SelectChip>
                      <SelectChip value="Lueftungsanlage" {...{ data, setData } }>Lüftungsanlage</SelectChip>
                      <SelectChip value="PV" {...{ data, setData } }>PV</SelectChip>
                      <SelectChip value="Akkuspeicher" {...{ data, setData } }>Akkuspeicher</SelectChip>
                      <SelectChip value="SmartHome" {...{ data, setData } }>Smart Home</SelectChip>
                      <SelectChip value="Wallbox" {...{ data, setData } }>Wallbox</SelectChip>
                      <SelectChip value="WaermepumpeInnen" {...{ data, setData } }>Wärmepumpe Innen</SelectChip>
                      <SelectChip value="WaermepumpeAussen" {...{ data, setData } }>Wärmepumpe Außen</SelectChip>
                    </Flex>

                    <ButtonGroup formValues={["Merkmale"]} hideSkip hasSubmit {...{ data, setData, active, setActive }} />
                  </form>
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Wie sind Deine Budgetvorstellungen?</Title>
                  <form onSubmit={handleSubmit}>
                    <RangeSlider
                      size="xl"
                      mt="xl"
                      mb="xl"
                      defaultValue={[
                        data.Budget_from ? parseInt(data.Budget_from) : 500,
                        data.Budget_to ? parseInt(data.Budget_to) : 900]}
                      min={100}
                      max={2000}
                      step={10}
                      label={(value) => value > 1000 ? `${(value / 1000).toFixed(2)} Mio. €` : `${value} Tsd. €`}
                      labelAlwaysOn
                      name="Budget"
                    />

                    <Checkbox
                      label="Grundstück vorhanden"
                      mb="md"
                      size="lg"
                      defaultChecked={data.GrundstueckVorhanden}
                      onChange={e => setData({ ...data, GrundstueckVorhanden: e.target.checked })}
                      name="GrundstueckVorhanden"
                    />

                    <ButtonGroup formValues={["Budget_from", "Budget_to"]} hideSkip hasSubmit {...{ data, setData, active, setActive }} />
                  </form>
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Fördermittel für Deine Immobilie</Title>

                  <form onSubmit={handleSubmit}>
                    Hier kommt noch etwas zu den Fördermitteln

                    <ButtonGroup hasSubmit {...{ data, setData, active, setActive }} />
                  </form>
                </Stepper.Step>
                <Stepper.Completed>
                  Fertig! Hier kommt dann der Checkout und danach der Report mit den Hausanbietern
                  {/* <Checkout /> */}
                </Stepper.Completed>
              </Stepper>
            </Modal>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
}
