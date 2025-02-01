import { useState } from 'react';
import { Flex, Text, Group, Button, Title, Box, Card, Stepper, rem, Modal, NumberInput, Select, List } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMapPin2, IconHome2, IconUser, IconHomeSearch, IconClockBolt, IconStar } from '@tabler/icons-react';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
import { mainSearches } from '@/utils/searchSeo'
import Checkout from '@/components/Checkout/Checkout';

const numberFormatElements = ['Radius', 'MinSize', 'MaxSize', 'Budget', 'Postalcode']

const ButtonGroup = ({ active, setActive, isLoading }) => {
  return <Group justify="space-between" mt="xl">
    { active === 0 && <div></div>}
    { active > 0 && <Button variant="default" onClick={() => setActive(active - 1)} loading={isLoading}>Zurück</Button> }
    { active < 3 && <Button type="submit" loading={isLoading}>Weiter</Button> }
  </Group>
}

export default function HausanbieterVergleich() {
  const [opened, { open, close }] = useDisclosure(false);
  const [active, setActive] = useState(0);
  const [data, setData] = useState({})
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
      title="ImmoRadar Förderung"
      description="todo"
    >
      <Box className={styles.header} py="xl">
        <div className={styles.background}></div>

        <Flex mih="calc(100vh - 70px - 64px)" h="100%" direction="column" justify="space-evenly">
          <Flex gap="xl" direction="column" justify="center" align="center">
            <Box p={{ base: "sm", sm: "xl", md: "0" }}>
              <Title order={1} ta="center" fz={{ base: 34, xs: 42, sm: 60, md: 60 }} fw="bold" mb="lg" mt={{ base: 'xl', md: 0 }} textWrap="balance">
                Der <span className={styles.gradientText}>Fertighausanbieter Vergleich</span>.
              </Title>
              <Title order={2} fz={{ base: 24, xs: 32, sm: 40, md: 48 }} ta={{ base: 'center', sm: 'left' }} mb="xl" fw={300}>
                Nutze unser Tool und spare dir die Stundenlange Recherche.
              </Title>
            </Box>

            <Button size="xl" onClick={open}>Fertighausanbieter Vergleich Starten</Button>

            <Modal opened={opened} onClose={close} title="Förderungsrechner" size="lg">
              <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">In welchem Bundesland wollen Sie bauen?</Title>

                  <form>
                  {/* Frage 1: Welcher Haustyp soll erworben werden
                  1.) Bungalow
                  2.) EFH
                  3.) EFH-Einliger Wohnung
                  4.) Doppelhaus
                  5.) Mehrfamilienhaus

                  Frage 2: Wie viele Geschosse sollen gebaut werden
                  1. 1,0 Geschoss ; 1,5 Geschoss; 2 Geschoss; 2,5 Geschoss;
                  oder mehr ; weiß nicht

                  Frage 3: Welche Dachform soll erstellt werden
                  Flachdach; Satteldach;Pultdach; Walmdach; sonstige

                  Frage 4: Welche Hausart wird bevorzugt
                  Freigeplantes Architektenhaus mit
                  Änderungesmöglichkeiten;
                  vorgeplantes Haus mit teilweise der Möglichkeit von
                  Änderungen
                  Typenhaus nur geringfügige Änderungen möglich

                  Frage 5: Welche Ausbauart möchten Sie bevorzugen
                  Basishaus nur Gebäudehülle zum Selbstausbau;
                  Basishaus + Technikfertig (Oberflächen können selbst
                  gestaltet werden);
                  Bezugsfertig komplett

                  Frage 6: Welche Hausgröße in m2

                  Frage 7: Ausstattungsqualität
                  Standard, gehoben, exklusiv, luxus

                  Frage 8: Was ist Ihnen zudem wichtig ?
                  Ökologischer Standard (KFW 40); Fußbodenheizung; Kamin/
                  ofen; Wärmepumpe innen; Wärmepumpe außen;
                  Lüftungsanlage;PV;Akkuspeicher; Smart home; Wall box

                  Frage 9 : Welche Budgetvorstellung
                  Hier sind Mark und ich ein wenig hängen geblieben, da eine
                  Merkmal definiert werden müssen:
                  Im ersten Schritt bitte ankreuzbar bar machen: Grundstück
                  vorhanden ja oder nein; Gesamtprojektsumme als regler
                  
                  Frage 10 : Fördermittel für Ihre Immobilie */}
                  </form>
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Weitere Fragen kommen hier...</Title>

                  <form onSubmit={handleSubmit}>
                    <NumberInput
                      label="Budget"
                      description="Welche Investition planen Sie für Ihr Grundstück?"
                      placeholder="300.000"
                      required
                      hideControls
                      mb="sm"
                      name="Budget"
                      rightSection="€"
                      thousandSeparator=" "
                      decimalScale={0}
                      defaultValue={data.Budget}
                    />

                    <ButtonGroup active={active} setActive={setActive} />
                  </form>
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="md">Sie können eine Förderung in Höhe von 2.000€ erhalten.</Title>
                  <Text mb="md">Unsere Berechnungen haben anhand Ihrer Angaben ermittelt, dass Sie für <b>2 Förderprojekte</b> in Frage kommen.</Text>
                  <Text mb="md">Schalten Sie jetzt den vollständigen Report für <b>20€</b> frei</Text>
                  <Text mb="md">Der Report beinahltet</Text>

                  <List>
                    <List.Item>Erkärungen und Links zu den Förderungen</List.Item>
                    <List.Item>Kontakt zu unserem Experten für weitere Fragen</List.Item>
                    <List.Item>Geld zurück Garantie falls keine Förderung erhalten wird</List.Item>
                  </List>

                  <form onSubmit={handleSubmit}>
                    <ButtonGroup active={active} setActive={setActive} />
                  </form>
                </Stepper.Step>
                <Stepper.Completed>
                  <Checkout />
                </Stepper.Completed>
              </Stepper>
            </Modal>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
}
