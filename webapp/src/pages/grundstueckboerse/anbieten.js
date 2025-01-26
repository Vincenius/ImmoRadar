import { useState } from 'react';
import Link from 'next/link';
import { Flex, Text, Group, Button, Title, Box, Card, Stepper, rem, TextInput, NumberInput, Textarea, ThemeIcon, Checkbox } from '@mantine/core';
import { IconMapPin2, IconHome2, IconUser, IconHomeDollar, IconClockBolt, IconMessage } from '@tabler/icons-react';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
import PhoneInput from '@/components/PhoneInput/PhoneInput';
import { isValidPhoneNumber } from 'libphonenumber-js'

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
  const [phone, setPhone] = useState('');
  const [isPhoneError, setIsPhoneError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formObject = {};
    const elements = e.target.elements;
    for (let element of elements) {
      if (element.name) {
        if (element.name === 'Phone') {
          if (isValidPhoneNumber(phone)) {
            formObject[element.name] = phone;
          } else {
            setIsPhoneError(true)
            return
          }
        } else if (numberFormatElements.includes(element.name)) {
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
      title="ImmoRadar Grundstücke Anbieten"
      description="Verkaufe Dein Grundstück. Unser Netzwerk umfasst eine Vielzahl Grundstücksuchenden. Dadurch können wir sicherstellen, dass Dein Grundstück in die besten Hände gelangt."
    >
      <Box>
        <div className={styles.background}></div>

        <Flex py="6rem" mih="calc(100vh - 64px - 52px - 16px)" h="100%" direction="column" justify="space-evenly">
          <Flex gap="xl" direction={{ base: "column", md: "row" }}>
            <Box p={{ base: "sm", sm: "xl", md: "0" }}>
              <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 60 }} fw="bold" mt={{ base: 'xl', md: 0 }} textWrap="balance">
                Einfach <span className={styles.gradientText}>Finden.</span>
              </Title>
              <Title order={2} fz={{ base: 24, xs: 32, sm: 40, md: 48 }} ta={{ base: 'center', md: 'left' }} mb="xl" fw={300}>
                Verkaufe Dein Grundstück.
              </Title>

              <Text size="lg" mb="xl" ta="left">
                Unser Netzwerk umfasst eine Vielzahl Grundstücksuchenden.
                Dadurch können wir sicherstellen, dass Dein Grundstück in die besten Hände gelangt.
              </Text>

              <Text size="lg" mb="xl" ta="left">
                Nutze unseren Service, um Dein Grundstück anzubieten!
                Trage hier einfach die relevanten Informationen zu Deinem Grundstück ein.
              </Text>

              <Text size="lg" mb="xl" ta="left">
                Wir prüfen Dein Angebot und präsentieren es potenziellen Käufern aus unserer umfangreichen Datenbank.
                Sobald sich ein interessierter Käufer findet, setzen wir uns mit Dir in Verbindung.
              </Text>
            </Box>

            <Card withBorder radius="md" p="lg" className={styles.searchCard} maw={500} miw={{ base: 300, md: 320 }} mx="auto" w="100%" mb="lg">
              <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step icon={<IconMapPin2 style={{ width: rem(18), height: rem(18) }} />}>
                  <Title order={2} size="h3" mb="lg">Wo liegt Dein Grundstück?</Title>

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
                  <Title order={2} size="h3" mb="lg">Welche Details kannst Du uns zu Deinem Grundstück mitteilen?</Title>

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
                      description="Was sollten wir noch zu Deinem Grundstück wissen?"
                      placeholder=""
                      name="Comment"
                      defaultValue={data.Comment}
                      mb="sm"
                    />

                    <ButtonGroup active={active} setActive={setActive} />
                  </form>
                </Stepper.Step>
                <Stepper.Step icon={<IconUser style={{ width: rem(18), height: rem(18) }} />}>
                  <Title order={2} size="h3" mb="lg">Wie können wir Dich erreichen?</Title>

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
                    <PhoneInput
                      label="Telefon"
                      placeholder="1711234567"
                      required
                      mb="md"
                      name="Phone"
                      initialCountryCode="DE"
                      value={phone}
                      onChange={value => {
                        setPhone(value)
                        setIsPhoneError(false)
                      }}
                      defaultValue={phone}
                      error={isPhoneError && 'Bitte gib eine gültige Telefonnummer ein'}
                    />
                    <Checkbox
                      required
                      label={<Text>Ich habe die <Link href="/datenschutz">Datenschutzbestimmungen</Link> gelesen und stimme ihnen zu.</Text>}
                    />

                    <ButtonGroup active={active} setActive={setActive} isLoading={isLoading} />
                  </form>
                </Stepper.Step>
                <Stepper.Completed>
                  <Title order={2} size="h3" mb="lg">Vielen Dank für Deine Anfrage!</Title>
                  <Text mb="sm">
                    Wir haben Deine Angaben erhalten und suchen jetzt passende Käufer für Dich.
                  </Text>
                  <Text mb="sm">
                    <b>Bitte bestätige Deine E-Mail-Adresse</b>, indem Du den Link in der gerade versendeten E-Mail anklicken.
                  </Text>
                  <Text mb="sm">
                    Sobald die Bestätigung erfolgt ist, erhälst Du die ersten Ergebnisse. Falls wir Rückfragen haben, werden wir uns direkt bei Dir melden.
                  </Text>
                  <Text>
                    Vielen Dank für Dein Vertrauen!
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
