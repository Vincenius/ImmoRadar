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

export default function Home() {
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
          formObject[element.name] = parseInt(element.value.replaceAll(',', ''));
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
                Jetzt <span className={styles.gradientText}>bis zu 10.000€</span> an Förderung für Ihr Bauvorhaben sichern.
              </Title>
            </Box>

            <Button size="xl" onClick={open}>Förderungsrechner Starten</Button>

            <Modal opened={opened} onClose={close} title="Förderungsrechner" size="lg">
              <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">In welchem Bundesland wollen Sie bauen?</Title>

                  <form onSubmit={handleSubmit}>
                    <Select
                      label="Bundesland"
                      data={mainSearches.map(s => s.primary.label)}
                      required
                      mb="sm"
                      name="region"
                      defaultValue={data.region}
                    />

                    <ButtonGroup active={active} setActive={setActive} />
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
                      thousandSeparator=","
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
                    <List.Item>Geld zurück Garantie falls die berechnete Förderung nicht erhalten wird</List.Item>
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
