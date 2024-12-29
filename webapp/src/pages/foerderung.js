import { useState } from 'react';
import { Flex, Text, Group, Button, Title, Box, Card, Stepper, rem, TextInput, NumberInput, Select } from '@mantine/core';
import { IconMapPin2, IconHome2, IconUser, IconHomeSearch, IconClockBolt, IconStar } from '@tabler/icons-react';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
import { mainSearches } from '@/utils/searchSeo'

const numberFormatElements = ['Radius', 'MinSize', 'MaxSize', 'Budget', 'Postalcode']

const ButtonGroup = ({ active, setActive, isLoading }) => {
  return <Group justify="space-between" mt="xl">
    { active === 0 && <div></div>}
    { active > 0 && <Button variant="default" onClick={() => setActive(active - 1)} loading={isLoading}>Zurück</Button> }
    { active < 3 && <Button type="submit" loading={isLoading}>Weiter</Button> }
  </Group>
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false);
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

    if (active === 2) {
      setIsLoading(true)

      // fetch('/api/property-signup', {
      //   method: 'POST',
      //   body: JSON.stringify(newData),
      // }).then(() => {
      //   setActive(active + 1)
      // }).catch((err) => {
      //   // todo error handling
      // }).finally(() => {
      //   setIsLoading(false)
      // })
    } else {
      setData(newData)
      setActive(active + 1)
    }
  }

  return (
    <Layout
      title="ImmoRadar Grundstücke"
      description="Entdecken Sie Grundstücke, die perfekt zu Ihren Wünschen passen. Geben Sie Ihre Anforderungen ein und wir helfen Ihnen, das ideale Grundstück zu finden."
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

            <Card withBorder radius="md" p="lg" maw={500} miw={{ base: 300, md: 320 }} mx="auto" w="100%" mb="lg">
              <Title order={2} ta="center" mb="lg">Förderungsrechner</Title>
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
                  <Title order={2} size="h3" mb="lg">TODO?</Title>

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
                  <Title order={2} size="h3" mb="lg">TODO</Title>

                  <form onSubmit={handleSubmit}>
                    <TextInput
                      label="Vorname"
                      placeholder="Max"
                      required
                      mb="sm"
                      name="Firstname"
                      defaultValue={data.Firstname}
                    />

                    <ButtonGroup active={active} setActive={setActive} isLoading={isLoading} />
                  </form>
                </Stepper.Step>
                <Stepper.Completed>
                  todo success
                </Stepper.Completed>
              </Stepper>
            </Card>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
}
