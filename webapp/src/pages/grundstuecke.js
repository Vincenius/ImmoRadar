import { useState } from 'react';
import { Flex, Text, Group, Button, Title, Box, Card, Stepper, rem, TextInput, NumberInput, Textarea } from '@mantine/core';
import { IconMapPin2, IconHome2, IconUser } from '@tabler/icons-react';
import { fetcher } from '@/utils/fetcher'
import Layout from '@/components/Layout/Layout'
import Logos from '@/components/Logos/Logos'
import SearchBar from '@/components/SearchBar/SearchBar';
import FeatureCards from '@/components/FeatureCards/FeatureCards';
import SearchPages from '@/components/SearchPages/SearchPages';
import FAQs from '@/components/FAQ/FAQ';
import styles from '@/styles/Home.module.css'

const ButtonGroup = ({ active, setActive }) => {

  return <Group justify="space-between" mt="xl">
    { active === 0 && <div></div>}
    { active > 0 && <Button variant="default" onClick={() => setActive(active - 1)}>Zurück</Button> }
    { active < 3 && <Button type="submit">Weiter</Button> }
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
        formObject[element.name] = element.value;
        // todo format thousand separator
      }
    }

    const newData = {
      ...data,
      ...formObject
    }

    console.log('SUBMIT', active)
    if (active === 2) {
      setIsLoading(true)
      setActive(active + 1)
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
      <Box className={styles.header}>
        <div className={styles.background}></div>

        <Flex mih="600px" h="calc(100vh - 70px - 64px)" direction="column" justify="space-evenly">
          <Flex gap="xl">
            <Box>
              <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 60 }} fw="bold" mb="lg" textWrap="balance">
                Finden Sie Ihr <span className={styles.gradientText}>Traumgrundstück</span>
              </Title>
              <Text size="lg" mb="xl">
                Entdecken Sie Grundstücke, die perfekt zu Ihren Wünschen passen. Geben Sie Ihre Anforderungen ein und wir helfen Ihnen, das ideale Grundstück zu finden.
              </Text>

              {/* icons features?? */}
            </Box>

            <Card withBorder radius="md" p="lg" className={styles.searchCard} maw={500} miw={300} mx="auto" w="100%">
              <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step icon={<IconMapPin2 style={{ width: rem(18), height: rem(18) }} />}>
                  <Title order={2} size="h3" mb="lg">In welcher Region soll Ihr Grundstück liegen?</Title>

                  <form onSubmit={handleSubmit}>
                    <NumberInput
                      label="Postleitzahl"
                      placeholder="12345"
                      required
                      hideControls
                      mb="sm"
                      name="Postalcode"
                      decimalScale={0}
                      defaultValue={data.Postalcode}
                    />
                    <TextInput
                      label="Ort"
                      placeholder="Köln"
                      required
                      mb="sm"
                      name="City"
                      defaultValue={data.City}
                    />
                    <NumberInput
                      label="Umkreis"
                      description="In welchem Radius um diesen Ort ist es noch möglich?"
                      placeholder="200"
                      required
                      hideControls
                      mb="sm"
                      rightSection="km"
                      name="Radius"
                      decimalScale={0}
                      thousandSeparator=","
                      defaultValue={data.Radius}
                    />
                    <TextInput
                      label="Städte ausschließen"
                      description="Welche Orte sind auf jeden Fall ausgeschlossen?"
                      placeholder="Leverkusen, Pulheim ..."
                      mb="sm"
                      name="ExcludeCity"
                      defaultValue={data.ExcludeCity}
                    />

                    <ButtonGroup active={active} setActive={setActive} />
                  </form>
                </Stepper.Step>
                <Stepper.Step icon={<IconHome2 style={{ width: rem(18), height: rem(18) }} />}>
                  <Title order={2} size="h3" mb="lg">Welche Größe und Eigenschaften sind Ihnen wichtig?</Title>

                  <form onSubmit={handleSubmit}>
                    <Flex gap="sm">
                      <NumberInput
                        label="Min. Größe des Grundstücks"
                        placeholder="100"
                        required
                        hideControls
                        mb="sm"
                        name="MinSize"
                        rightSection="m²"
                        thousandSeparator=","
                        decimalScale={0}
                        defaultValue={data.MinSize}
                      />
                      <NumberInput
                        label="Max. Größe des Grundstücks"
                        placeholder="500"
                        required
                        hideControls
                        mb="sm"
                        name="MaxSize"
                        rightSection="m²"
                        thousandSeparator=","
                        decimalScale={0}
                        defaultValue={data.MaxSize}
                      />
                    </Flex>
                    
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
                    <Textarea
                      label="Anmerkungen"
                      description="Was ist Ihnen in Ihre Nähe noch wichtig?"
                      placeholder="Nähe zu ÖPNV, Soziales Umfeld (Schulen, Kindergärten) ..."
                      name="Comment"
                      defaultValue={data.Comment}
                      mb="sm"
                    />

                    <ButtonGroup active={active} setActive={setActive} />
                  </form>
                </Stepper.Step>
                <Stepper.Step icon={<IconUser style={{ width: rem(18), height: rem(18) }} />}>
                  <Title order={2} size="h3" mb="lg">Wie können wir Sie erreichen, um Ihnen passende Grundstücke vorzustellen?</Title>

                  <form onSubmit={handleSubmit}>
                    <TextInput
                      label="Vorname"
                      placeholder="Max"
                      required
                      mb="sm"
                      name="Firstname"
                      defaultValue={data.Firstname}
                    />
                    <TextInput
                      label="Nachname"
                      placeholder="Musterman"
                      required
                      mb="sm"
                      name="Lastname"
                      defaultValue={data.Lastname}
                    />
                    <TextInput
                      label="Email"
                      placeholder="maxmustermann@example.com"
                      required
                      mb="sm"
                      name="Email"
                      type="email"
                      defaultValue={data.Email}
                    />
                    <TextInput
                      label="Telefon"
                      placeholder="0171 1234567"
                      required
                      mb="sm"
                      name="Phone"
                      defaultValue={data.Phone}
                    />

                    <ButtonGroup active={active} setActive={setActive} />
                  </form>
                </Stepper.Step>
                <Stepper.Completed>
                  <Title order={2} size="h3" mb="lg">Vielen Dank für Ihre Anfrage!</Title>
                  <Text mb="sm">
                   Wir haben Ihre Angaben erhalten und suchen jetzt passende Grundstücke für Sie.
                  </Text>
                  <Text mb="sm">
                    Sie erhalten eine E-Mail sobald wir die ersten Ergebnissen haben. Falls wir Rückfragen haben, werden wir uns direkt bei Ihnen melden.
                  </Text>
                  <Text>
                    Vielen Dank für Ihr Vertrauen!
                  </Text>
                </Stepper.Completed>
              </Stepper>
            </Card>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
}
