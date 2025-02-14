import { useState } from 'react';
import { Flex, Text, Group, Button, Title, Box, Checkbox, Stepper, rem, Modal, Select, List } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import SelectButton from '@/components/Inputs/SelectButton';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
import { mainSearches } from '@/utils/searchSeo'
import CheckboxCard from '@/components/Inputs/CheckboxCard';
// import Checkout from '@/components/Checkout/Checkout';

const ButtonGroup = ({ active, setActive, isLoading, hasSubmit }) => {
  return <Group justify="space-between" mt="xl">
    {active === 0 && <div></div>}
    {active > 0 && <Button variant="default" onClick={() => setActive(active - 1)} loading={isLoading}>Zurück</Button>}
    {active < 4 && <Flex gap="sm">
      {hasSubmit && <Button type="submit" loading={isLoading}>Weiter</Button>}
    </Flex>}
  </Group>
}

export default function Home() {
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
                    <SelectButton name="HausTyp" value="Bestand" onClick={selectOption} fullWidth>Bestand</SelectButton>
                    <SelectButton name="HausTyp" value="Neubau" onClick={selectOption} fullWidth>Neubau</SelectButton>
                  </Flex>

                  <ButtonGroup {...{ data, setData, active, setActive }} />
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Welche Art der Förderung suchen Sie?</Title>
                  {/* todo handle data checked */}
                  <CheckboxCard title="Zuschuss" mb="lg" />
                  <CheckboxCard title="Kredit" />

                  <ButtonGroup {...{ data, setData, active, setActive }} hasSubmit />
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Wo befindet sich die Immobilie?</Title>

                  {/* todo */}
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
                  todoooo
                </Stepper.Step>
                {/* <Stepper.Completed>
                  <Checkout />
                </Stepper.Completed> */}
              </Stepper>
            </Modal>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
}
