import { useState } from 'react';
import { Flex, Group, Button, Title, Box, Stepper, Modal, RangeSlider, Grid, Chip } from '@mantine/core';
import Checkbox from '@/components/Inputs/Checkbox';
import { useDisclosure } from '@mantine/hooks';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
// import Checkout from '@/components/Checkout/Checkout';

const numberFormatElements = ['Radius', 'MinSize', 'MaxSize', 'Budget', 'Postalcode']

const ButtonGroup = ({ active, setActive, isLoading, hasSubmit, hideSkip }) => {
  // todo reset data if frage überspringen
  return <Group justify="space-between" mt="xl">
    { active === 0 && <div></div>}
    { active > 0 && <Button variant="default" onClick={() => setActive(active - 1)} loading={isLoading}>Zurück</Button> }
    { active < 10 && <Flex gap="sm">
      { !hideSkip && <Button onClick={() => setActive(active + 1)} variant="light">Frage überspringen</Button> }
      { hasSubmit && <Button type="submit" loading={isLoading}>Weiter</Button> }
    </Flex> }
  </Group>
}

export default function HausanbieterVergleich() {
  const [opened, { open, close }] = useDisclosure(false);
  const [active, setActive] = useState(0);
  const [data, setData] = useState({})

  const selectOption = (e) => {
    let elem = e.target
    while (!elem.name) {
      elem = elem.parentElement
    }
    setData({ ...data, [elem.name]: elem.value })
    setActive(active + 1)
  }

  // console.log(data) // TODO remove

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
              <Title order={1} ta="center" fz={{ base: 34, xs: 42, sm: 60, md: 60 }} fw="bold" mb="lg" mt={{ base: 'xl', md: 0 }} textWrap="balance">
                Der <span className={styles.gradientText}>Fertighausanbieter Vergleich</span>.
              </Title>
              <Title order={2} fz={{ base: 24, xs: 32, sm: 40, md: 48 }} ta={{ base: 'center', sm: 'left' }} mb="xl" fw={300}>
                Nutze unser Tool und spare dir die Stundenlange Recherche.
              </Title>
            </Box>

            <Button size="xl" onClick={open}>Fertighausanbieter Vergleich Starten</Button>

            <Modal opened={opened} onClose={close} title="Hausanbieter Vergleich" size="md">
              <Stepper active={active} onStepClick={setActive} size="md" allowNextStepsSelect={false}>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Welcher Haustyp soll erworben werden?</Title>

                  <Grid columns={{ base: 1, sm: 2, md: 3 }}>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="type" value="bungalow" onClick={selectOption}>Bungalow</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="type" value="efh" onClick={selectOption}>EFH</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="type" value="efh-einliger" onClick={selectOption}>EFH-Einliger Wohnung</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="type" value="doppelhaus" onClick={selectOption}>Doppelhaus</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="type" value="mehrfamilienhaus" onClick={selectOption}>Mehrfamilienhaus</Button>
                    </Grid.Col>
                  </Grid>

                  <ButtonGroup active={active} setActive={setActive} formValue="type"/>
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Wie viele Geschosse sollen gebaut werden?</Title>
                  <Grid columns={{ base: 1, sm: 2, md: 3 }}>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="floors" value="1" onClick={selectOption}>1 Geschoss</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="floors" value="1,5" onClick={selectOption}>1,5 Geschosse</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="floors" value="2" onClick={selectOption}>2 Geschosse</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="floors" value="2,5" onClick={selectOption}>2,5 Geschosse</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="floors" value=">2,5" onClick={selectOption}>Mehr als 2,5 Geschosse</Button>
                    </Grid.Col>
                  </Grid>

                  <ButtonGroup active={active} setActive={setActive} formValue="floors" />
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Welche Dachform soll erstellt werden?</Title>
                  <Grid columns={{ base: 1, sm: 2, md: 3 }}>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="roof" value="flachdach" onClick={selectOption}>Flachdach</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="roof" value="satteldach" onClick={selectOption}>Satteldach</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="roof" value="pultdach" onClick={selectOption}>Pultdach</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="roof" value="walmdach" onClick={selectOption}>Walmdach</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="roof" value=">sonstige" onClick={selectOption}>Sonstige</Button>
                    </Grid.Col>
                  </Grid>

                  <ButtonGroup active={active} setActive={setActive} formValue="roof" />
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Welche Hausart wird bevorzugt?</Title>
                  <Button mb="md" styles={{ label: { whiteSpace: 'initial' }, root: { height: 'auto', padding: '15px 10px' } }} size="md" variant="outline" name="changes" value="architektenhaus" onClick={selectOption}>Freigeplantes Architektenhaus mit Änderungesmöglichkeiten</Button>

                  <Button mb="md" styles={{ label: { whiteSpace: 'initial' }, root: { height: 'auto', padding: '15px 10px' } }} size="md" variant="outline" name="changes" value="vorgeplanteshaus" onClick={selectOption}>vorgeplantes Haus mit teilweise der Möglichkeit von Änderungen</Button>

                  <Button mb="md" styles={{ label: { whiteSpace: 'initial' }, root: { height: 'auto', padding: '15px 10px' } }} size="md" variant="outline" name="changes" value="typenhaus" onClick={selectOption}>Typenhaus nur geringfügige Änderungen möglich</Button>


                  <ButtonGroup active={active} setActive={setActive} formValue="changes" />
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Welche Ausbauart wird bevorzugt?</Title>
                  <Button fullWidth mb="md" styles={{ label: { whiteSpace: 'initial' }, root: { height: 'auto', padding: '15px 10px' } }} size="md" variant="outline" name="fitout" value="basishaus-selbstausbau" onClick={selectOption}>Basishaus nur Gebäudehülle zum Selbstausbau</Button>

                  <Button fullWidth mb="md" styles={{ label: { whiteSpace: 'initial' }, root: { height: 'auto', padding: '15px 10px' } }} size="md" variant="outline" name="fitout" value="basishaus-technikfertig" onClick={selectOption}>Basishaus + Technikfertig (Oberflächen können selbst gestaltet werden)</Button>

                  <Button fullWidth mb="md" styles={{ label: { whiteSpace: 'initial' }, root: { height: 'auto', padding: '15px 10px' } }} size="md" variant="outline" name="fitout" value="bezugsfertig" onClick={selectOption}>Bezugsfertig komplett</Button>

                  <ButtonGroup active={active} setActive={setActive} formValue="fitout" />
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Welche Hausgröße in m²?</Title>

                  <form onSubmit={handleSubmit}>
                    <RangeSlider
                      size="xl"
                      mt="xl"
                      mb="xl"
                      defaultValue={[75, 125]} // todo default
                      min={50}
                      max={500}
                      step={1}
                      labelAlwaysOn
                      name="size"
                    />

                    <ButtonGroup active={active} setActive={setActive} formValue="size" hasSubmit={true} />
                  </form>
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Ausstattungsqualität?</Title>
                  <Grid columns={{ base: 1, sm: 2, md: 3 }}>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="quality" value="standard" onClick={selectOption}>Standard</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="quality" value="gehoben" onClick={selectOption}>Gehoben</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="quality" value="exklusiv" onClick={selectOption}>Exklusiv</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Button size="lg" variant="outline" name="quality" value="luxus" onClick={selectOption}>Luxus</Button>
                    </Grid.Col>
                  </Grid>

                  <ButtonGroup active={active} setActive={setActive} formValue="quality" />
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Was ist Dir zudem wichtig?</Title>
                  <form onSubmit={handleSubmit}>
                    {/* todo default values */}
                    <Grid>
                      <Chip size="lg" value="KFW 40" m="xs" name="features">KFW 40</Chip>
                      <Chip size="lg" value="Fussbodenheizung" m="xs" name="features">Fussbodenheizung</Chip>
                      <Chip size="lg" value="Kamin" m="xs" name="features">Kamin</Chip>
                      <Chip size="lg" value="Ofen" m="xs" name="features">Ofen</Chip>
                      <Chip size="lg" value="Wärmepumpe innen" m="xs" name="features">Wärmepumpe innen</Chip>
                      <Chip size="lg" value="Wärmepumpe außen" m="xs" name="features">Wärmepumpe außen</Chip>
                      <Chip size="lg" value="Lüftungsanlage" m="xs" name="features">Lüftungsanlage</Chip>
                      <Chip size="lg" value="PV" m="xs" name="features">PV</Chip>
                      <Chip size="lg" value="Akkuspeicher" m="xs" name="features">Akkuspeicher</Chip>
                      <Chip size="lg" value="Smart home" m="xs" name="features">Smart Home</Chip>
                      <Chip size="lg" value="Wall box" m="xs" name="features">Wall box</Chip>
                    </Grid>

                    <ButtonGroup active={active} setActive={setActive} formValue="features" hideSkip hasSubmit />
                  </form>
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Wie sind Deine Budgetvorstellungen?</Title>
                  <form onSubmit={handleSubmit}>
                    <RangeSlider
                      size="xl"
                      mt="xl"
                      mb="xl"
                      defaultValue={[500, 900]} // todo default
                      min={100}
                      max={2000}
                      step={10}
                      label={(value) => value > 1000 ? `${(value / 1000).toFixed(2)} Mio. €` : `${value} Tsd. €`}
                      labelAlwaysOn
                      name="budget"
                    />

                    <Checkbox
                      label="Grundstück vorhanden"
                      mb="md"
                      size="lg"
                      defaultChecked={data.BuildingLicense !== false}
                      name="BuildingLicense"
                    />

                    <ButtonGroup active={active} setActive={setActive} formValue="features" hideSkip hasSubmit />
                  </form>
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Fördermittel für Deine Immobilie</Title>

                  <form onSubmit={handleSubmit}>
                    TODO

                    <ButtonGroup active={active} setActive={setActive} hasSubmit />
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
