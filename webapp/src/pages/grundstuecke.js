import { useState } from 'react';
import { Flex, Text, Group, Button, Title, Box, Card, Stepper, rem, TextInput, NumberInput, Textarea, ThemeIcon } from '@mantine/core';
import { IconMapPin2, IconHome2, IconUser, IconHomeSearch, IconClockBolt, IconStar } from '@tabler/icons-react';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'

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

      fetch('/api/property-signup', {
        method: 'POST',
        body: JSON.stringify(newData),
      }).then(() => {
        setActive(active + 1)
      }).catch((err) => {
        // todo error handling
      }).finally(() => {
        setIsLoading(false)
      })
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

        <Flex mih="calc(100vh - 70px - 64px)" h="100%" direction="column" justify="space-evenly">
          <Flex gap="xl" direction={{ base: "column", md: "row" }}>
            <Box p={{ base: "sm", sm: "xl", md: "0" }}>
              <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 60 }} fw="bold" mb="lg" mt={{ base: 'xl', md: 0 }} textWrap="balance">
                Finden Sie Ihr <span className={styles.gradientText}>Traumgrundstück</span>
              </Title>
              <Text size="lg" mb="xl" ta={{ base: 'center', md: 'left' }}>
                Entdecken Sie Grundstücke, die perfekt zu Ihren Wünschen passen. Geben Sie Ihre Anforderungen ein und wir helfen Ihnen, das ideale Grundstück zu finden.
              </Text>


              <Flex gap={{ base: "sm", sm: "lg" }} direction={{ base: "column", sm: "row" }}>
                <Flex gap="md" align={{ base: "center", sm: "start" }} mb="xl" direction={{ base: "row", sm: "column" }}>
                  <ThemeIcon variant="outline">
                    <IconHomeSearch style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                  <Text><b>Individuelle Grundstücksauswahl</b>: Wir filtern passende Grundstücke nach Ihren spezifischen Anforderungen.</Text>
                </Flex>

                <Flex gap="md" align={{ base: "center", sm: "start" }} mb="xl" direction={{ base: "row", sm: "column" }}>
                  <ThemeIcon variant="outline">
                    <IconClockBolt style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                  <Text><b>Schneller und unkomplizierter Prozess</b>: Sparen Sie Zeit und Nerven mit unserem einfach zu bedienenden Service.</Text>
                </Flex>

                <Flex gap="md" align={{ base: "center", sm: "start" }} direction={{ base: "row", sm: "column" }}>
                  <ThemeIcon variant="outline">
                    <IconStar style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                  <Text><b>Exklusive Grundstücke</b>: Entdecken Sie einmalige Grundstücke, die nur über unsere Plattform verfügbar sind und nirgendwo anders gelistet werden..</Text>
                </Flex>
              </Flex>
            </Box>

            <Card withBorder radius="md" p="lg" className={styles.searchCard} maw={500} miw={300} mx="auto" w="100%" mb="lg">
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
                      maxLength={5}
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

                    <ButtonGroup active={active} setActive={setActive} isLoading={isLoading} />
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
