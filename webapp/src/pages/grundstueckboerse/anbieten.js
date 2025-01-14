import { useState } from 'react';
import { Flex, Text, Group, Button, Title, Box, Card, Stepper, rem, TextInput, NumberInput, Textarea, ThemeIcon } from '@mantine/core';
import { IconMapPin2, IconHome2, IconUser, IconHomeDollar, IconClockBolt, IconMessage } from '@tabler/icons-react';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'

const numberFormatElements = ['Size', 'Price', 'Postalcode']

const ButtonGroup = ({ active, setActive, isLoading }) => {
  return <Group justify="space-between" mt="xl">
    { active === 0 && <div></div>}
    { active > 0 && <Button variant="default" onClick={() => setActive(active - 1)} disabled={isLoading}>Zurück</Button> }
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

    if (active === 2) {
      setIsLoading(true)

      fetch('/api/user-signup', {
        method: 'POST',
        body: JSON.stringify({
          ...newData,
          type: 'property'
        }),
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
      title="ImmoRadar Grundstücke Suchen"
      description="Entdecken Sie Grundstücke, die perfekt zu Ihren Wünschen passen. Geben Sie Ihre Anforderungen ein und wir helfen Ihnen, das ideale Grundstück zu finden."
    >
      <Box>
        <div className={styles.background}></div>

        <Flex py="6rem" mih="calc(100vh - 64px - 52px - 16px)" h="100%" direction="column" justify="space-evenly">
          <Flex gap="xl" direction={{ base: "column", md: "row" }}>
            <Box p={{ base: "sm", sm: "xl", md: "0" }}>
              <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 60 }} fw="bold" mb="lg" mt={{ base: 'xl', md: 0 }} textWrap="balance">
                Verkaufen Sie Ihr <span className={styles.gradientText}>Grundstück</span>
              </Title>
              <Text size="lg" mb="xl" ta={{ base: 'center', md: 'left' }}>
                Möchten Sie Ihr Grundstück erfolgreich verkaufen? Unsere Grundstücksbörse hilft Ihnen dabei, einen Käufer zu finden.
              </Text>

              <Flex gap={{ base: "sm", sm: "lg" }} direction={{ base: "column", sm: "row" }}>
                <Flex gap="md" align={{ base: "center", sm: "start" }} mb="xl" direction={{ base: "row", sm: "column" }} w="100%">
                  <ThemeIcon variant="outline">
                    <IconHomeDollar style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                  <Text><b>Gezielte Käuferansprache</b>: Erreichen Sie potenzielle Käufer, die aktiv auf der Suche nach Grundstücken in Ihrer Region sind.</Text>
                </Flex>

                <Flex gap="md" align={{ base: "center", sm: "start" }} mb="xl" direction={{ base: "row", sm: "column" }} w="100%">
                  <ThemeIcon variant="outline">
                    <IconClockBolt style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                  <Text><b>Schnelle und einfache Inserierung</b>: Inserieren Sie Ihr Grundstück in wenigen Schritten.</Text>
                </Flex>
              </Flex>
            </Box>

            <Card withBorder radius="md" p="lg" className={styles.searchCard} maw={500} miw={{ base: 300, md: 320 }} mx="auto" w="100%" mb="lg">
              <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step icon={<IconMapPin2 style={{ width: rem(18), height: rem(18) }} />}>
                  <Title order={2} size="h3" mb="lg">Wo liegt Ihr Grundstück?</Title>

                  <form onSubmit={handleSubmit}>
                    <TextInput
                      label="Adresse"
                      placeholder="Straße und Hausnummer"
                      required
                      mb="sm"
                      name="Address"
                      defaultValue={data.Address}
                    />
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

                    <ButtonGroup active={active} setActive={setActive} />
                  </form>
                </Stepper.Step>
                <Stepper.Step icon={<IconHome2 style={{ width: rem(18), height: rem(18) }} />}>
                  <Title order={2} size="h3" mb="lg">Welche Details können Sie uns zu Ihrem Grundstück mitteilen?</Title>

                  <form onSubmit={handleSubmit}>
                    <NumberInput
                      label="Größe des Grundstücks"
                      placeholder="500"
                      required
                      hideControls
                      mb="sm"
                      name="Size"
                      rightSection="m²"
                      thousandSeparator=" "
                      decimalScale={0}
                      defaultValue={data.Size}
                    />
                    <NumberInput
                      label="Preis"
                      description="Wie viel ist Ihnen das Grundstück in etwa Wert?"
                      placeholder="300.000"
                      required
                      hideControls
                      mb="sm"
                      name="Price"
                      rightSection="€"
                      thousandSeparator=" "
                      decimalScale={0}
                      defaultValue={data.Price}
                    />
                    <Textarea
                      label="Anmerkungen"
                      description="Was sollten wir noch zu Ihrem Grundstück wissen?"
                      placeholder=""
                      name="Comment"
                      defaultValue={data.Comment}
                      mb="sm"
                    />

                    <ButtonGroup active={active} setActive={setActive} />
                  </form>
                </Stepper.Step>
                <Stepper.Step icon={<IconUser style={{ width: rem(18), height: rem(18) }} />}>
                  <Title order={2} size="h3" mb="lg">Wie können wir Sie erreichen?</Title>

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
                    Wir haben Ihre Angaben erhalten und suchen jetzt passende Käufer für Sie.
                  </Text>
                  <Text mb="sm">
                    <b>Bitte bestätigen Sie Ihre E-Mail-Adresse</b>, indem Sie den Link in der gerade versendeten E-Mail anklicken.
                  </Text>
                  <Text mb="sm">
                    Sobald die Bestätigung erfolgt ist, erhalten Sie die ersten Ergebnisse. Falls wir Rückfragen haben, werden wir uns direkt bei Ihnen melden.
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
