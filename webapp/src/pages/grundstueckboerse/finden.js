import { useState } from 'react';
import Link from 'next/link';
import { Flex, Text, Group, Button, Title, Box, Card, Stepper, rem, TextInput, NumberInput, Textarea, Checkbox, Blockquote } from '@mantine/core';
import { IconMapPin2, IconHome2, IconUser, IconSearch } from '@tabler/icons-react';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
import PhoneInput from '@/components/PhoneInput/PhoneInput';
import FileUpload from '@/components/FileUpload/FileUpload';
import { handleFiles } from '@/utils/fileUpload'
import { isValidPhoneNumber } from 'libphonenumber-js'

const numberFormatElements = ['Radius', 'MinSize', 'MaxSize', 'Budget', 'Postalcode']

const ButtonGroup = ({ active, setActive, isLoading, disabled }) => {
  return <Group justify="space-between" mt="xl">
    {active === 0 && <div></div>}
    {active > 0 && <Button variant="default" onClick={() => setActive(active - 1)} disabled={isLoading || disabled}>Zurück</Button>}
    {active < 4 && <Button type="submit" loading={isLoading} disabled={disabled}>Weiter</Button>}
  </Group>
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [isPhoneError, setIsPhoneError] = useState(false);
  const [option, setOption] = useState('')
  const [isFileSizeError, setIsFileSizeError] = useState(false);
  const [files, setFiles] = useState([]);

  const handleOption = (val) => {
    setOption(val)
    setActive(1)
  }

  const handleSubmit = async (e) => {
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

    if (active === 3) {
      setIsLoading(true)

      const fileData = await handleFiles(files)

      fetch('/api/user-signup', {
        method: 'POST',
        body: JSON.stringify({
          ...newData,
          files: fileData,
          type: 'search'
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
      description="Du konntest kein passendes Grundstück für Dich finden? Trag hier einfach Deinen persönlichen Rahmendaten zu Deinem Traumgrundstück ein. Wir gleichen Deine Daten mit den Grundstücken in unserer Datenbank und melden uns bei Dir sobald etwas passendes dabei ist."
    >
      <div className={styles.background}></div>
      <Box>
        <Flex pt="6rem" pb="3rem" mih="calc(100vh - 64px - 52px - 16px)" h="100%" direction="column" justify="space-evenly">
          <Flex gap="xl" direction={{ base: "column", md: "row" }}>
            <Box p={{ base: "sm", sm: "xl", md: "0" }}>
              <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 60 }} fw="bold" mt={{ base: 'xl', md: 0 }} textWrap="balance">
                Einfach <span className={styles.gradientText}>Finden.</span>
              </Title>
              <Title order={2} fz={{ base: 24, xs: 32, sm: 40, md: 48 }} ta={{ base: 'center', md: 'left' }} mb="xl" fw={300}>
                Dein Traumgrundstück.
              </Title>
              <Text size="lg" mb="xl" ta="left">
                Unser Netzwerk besteht aus Projektgesellschaften, Privatpersonen und Kommunen.
                So sind wir in der Lage, unsere Datenbank stetig weiter zu füllen.
              </Text>

              <Text size="lg" mb="xl" ta="left">
                Nutze einfach unseren Service!<br />
                <b>100% kostenlos und unverbindlich.</b>
              </Text>

              <Text size="lg" mb="xl" ta="left">
                Trag hier einfach Deinen persönlichen Rahmendaten zu Deinem Traumgrundstück ein.
              </Text>

              <Text size="lg" mb="xl" ta="left">
                Wir gleichen Deine Daten dann mit den Grundstücken in unserer Datenbank ab und melden uns bei Dir sobald ein passendes Grundstück dabei ist.
              </Text>
            </Box>

            <Card withBorder radius="md" p="lg" className={styles.searchCard} maw={500} miw={{ base: 300, md: 320 }} mx="auto" w="100%" mb="lg">
              <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step icon={<IconSearch style={{ width: rem(18), height: rem(18) }} />} allowStepSelect={false}>
                  <Title order={2} size="h3" mb="xl">Wie dürfen wir Dich unterstützen?</Title>

                  <Button size="lg" mb="xl" fullWidth styles={{ label: { whiteSpace: 'wrap' }, root: { height: '100%', padding: '10px' } }} onClick={() => handleOption('search')}>
                    Ich bin auf der Suche nach einem passenden Grundstück
                  </Button>
                  <Button size="lg" variant="outline" fullWidth styles={{ label: { whiteSpace: 'wrap' }, root: { height: '100%', padding: '10px' } }} onClick={() => handleOption('research')}>
                    Ich möchte wissen ob auf einem mir bekannten Grundstücks gebaut werden darf
                  </Button>

                </Stepper.Step>
                <Stepper.Step icon={<IconMapPin2 style={{ width: rem(18), height: rem(18) }} />} allowStepSelect={false}>
                  {option === 'search' && <Title order={2} size="h3" mb="lg">In welcher Region soll Dein Grundstück liegen?</Title>}
                  {option === 'research' && <Title order={2} size="h3" mb="lg">Wo befindet sich das Grundstück?</Title>}

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
                    {option === 'search' && <>
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
                        thousandSeparator=" "
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
                    </>}
                    {option === 'research' && <>
                      <TextInput
                        label="Adresse"
                        description="Wo befindet sich das Grundstück?"
                        placeholder="Neben der Hauptstraße 29"
                        mb="sm"
                        name="Address"
                        required
                        defaultValue={data.Address}
                      />

                      <FileUpload files={files} setFiles={setFiles} isFileSizeError={isFileSizeError} setIsFileSizeError={setIsFileSizeError} />
                    </>}

                    <ButtonGroup active={active} setActive={setActive} disabled={isFileSizeError} />
                  </form>
                </Stepper.Step>
                <Stepper.Step icon={<IconHome2 style={{ width: rem(18), height: rem(18) }} />} allowStepSelect={false}>
                  {option === 'search' && <Title order={2} size="h3" mb="lg">Welche Größe und Eigenschaften sind Dir wichtig?</Title>}
                  {option === 'research' && <Title order={2} size="h3" mb="lg">Welche Eigenschaften sind Dir wichtig?</Title>}

                  <form onSubmit={handleSubmit}>
                    {option === 'search' &&
                      <Flex gap="sm">
                        <NumberInput
                          label="Min. Größe des Grundstücks"
                          placeholder="100"
                          required
                          hideControls
                          mb="sm"
                          name="MinSize"
                          rightSection="m²"
                          thousandSeparator=" "
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
                          thousandSeparator=" "
                          decimalScale={0}
                          defaultValue={data.MaxSize}
                        />
                      </Flex>
                    }

                    <NumberInput
                      label="Budget"
                      description="Welche Investition planst Du für Dein Grundstück?"
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
                    <Textarea
                      label="Anmerkungen"
                      description={option === 'search' ? "Was ist Dir in Deiner Nähe noch wichtig?" : "Was sollten wir noch Wissen?"}
                      placeholder={option === 'search' ? "Nähe zu ÖPNV, Soziales Umfeld (Schulen, Kindergärten) ..." : ""}
                      name="Comment"
                      defaultValue={data.Comment}
                      mb="sm"
                    />

                    <ButtonGroup active={active} setActive={setActive} />
                  </form>
                </Stepper.Step>
                <Stepper.Step icon={<IconUser style={{ width: rem(18), height: rem(18) }} />} allowStepSelect={false}>
                  <Title order={2} size="h3" mb="lg">Wie können wir Dich erreichen, um Dir passende Grundstücke vorzustellen?</Title>

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
                      styles={{ body: { alignItems: 'center' } }}
                      label={<Text>Ich habe die <Link href="/datenschutz">Datenschutzbestimmungen</Link> gelesen und stimme ihnen zu.</Text>}
                    />

                    <ButtonGroup active={active} setActive={setActive} isLoading={isLoading} />
                  </form>
                </Stepper.Step>
                <Stepper.Completed>
                  <Title order={2} size="h3" mb="lg">Vielen Dank für Deine Anfrage!</Title>
                  <Text mb="sm">
                    Wir haben Deine Angaben erhalten und suchen jetzt passende Grundstücke für Dich.
                  </Text>
                  <Text mb="sm">
                    <b>Bitte bestätigen Deine E-Mail-Adresse</b>, indem Du den Link in der gerade versendeten E-Mail anklicken.
                  </Text>
                  <Text mb="sm">
                    Sobald die Bestätigung erfolgt ist, erhalte die ersten Ergebnisse. Falls wir Rückfragen haben, werden wir uns direkt bei Dir melden.
                  </Text>
                  <Text>
                    Vielen Dank für Dein Vertrauen!
                  </Text>
                </Stepper.Completed>
              </Stepper>
            </Card>
          </Flex>
        </Flex>

        {/* <Blockquote color="cyan.1" cite="– Josh Billings" mb="xl">
          Seien Sie wie eine Briefmarke - heften Sie sich an eine Sache, bis Sie Ihr Ziel erreicht haben.
        </Blockquote> */}
      </Box>
    </Layout>
  );
}
