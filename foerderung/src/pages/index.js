import { useState } from 'react';
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { Flex, Text, Group, Button, Title, Box, TextInput, Stepper, Table, Modal, Chip, Select, Radio, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import SelectButton from '@/components/Inputs/SelectButton';
import Layout from '@/components/Layout/Layout'
import styles from '@/styles/Home.module.css'
import { bundeslaender } from '@/utils/bundeslaender'
import CheckboxCard from '@/components/Inputs/CheckboxCard';
import Checkbox from '@/components/Inputs/Checkbox';
import { fetcher } from '@/utils/fetcher';

const SelectChip = ({ children, data, setData, value, ...props }) => {
  const handleChange = () => {
    setData({
      ...data,
      Measures: data['Measures']?.includes(value)
        ? data['Measures']?.filter((m) => m !== value)
        : [...(data['Measures'] || []), value]
    })
  }
  return (
    <Chip
      size="lg"
      variant="outline"
      styles={{ root: { flexGrow: 1 }, label: { width: '100%', justifyContent: 'center' } }}
      checked={data['Measures']?.includes(value)}
      onChange={handleChange}
      {...props}
    >
      {children}
    </Chip>
  )
}

const numberFormatElements = ['Postalcode']

const ButtonGroup = ({ active, setActive, isLoading, hasSubmit, disabled }) => {
  return <Group justify="space-between" mt="xl">
    {active === 0 && <div></div>}
    {active > 0 && <Button variant="default" onClick={() => setActive(active - 1)} loading={isLoading}>Zurück</Button>}
    {active < 4 && <Flex gap="sm">
      {hasSubmit && <Button type="submit" loading={isLoading} disabled={disabled}>Weiter</Button>}
    </Flex>}
  </Group>
}

export default function Foerderung() {
  const router = useRouter()
  const [opened, { open, close }] = useDisclosure(false);
  const [active, setActive] = useState(0);
  const [questionnaireStep, setQuestionnaireStep] = useState(0);
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ TypZuschuss: true, TypKredit: true })
  const [email, setEmail] = useState('')
  const { data: subsidyData = [] } = useSWR('/api/subsidies', fetcher)

  const selectOption = (e) => {
    let elem = e.target
    while (!elem.name) {
      elem = elem.parentElement
    }
    setData({ ...data, [elem.name]: elem.value })
    setActive(active + 1)
  }

  const handleSubmitNext = (e) => {
    e.preventDefault();
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

  const handleSubmitQuestionnaire = (e, d) => {
    e.preventDefault()
    setQuestionnaireStep(questionnaireStep + 1)
  }

  const districtData = [...new Set(
    subsidyData
      .filter(d => d.Region === data.Region && d.District)
      .map(d => d.District)
  )].sort()

  const measuresData = [...new Set(
    subsidyData.filter(d =>
      d.HouseType.includes(data.HouseType) &&
      (d.Region === data.Region || d.Region === 'Bundesweit') &&
      (d.District === data.District || !d.District) &&
      (
        data.TypZuschuss && d.Type.includes('Zuschuss') ||
        data.TypKredit && d.Type.includes('Kredit')
      )
    ).map(d => d.Measures).flat().filter(Boolean)
  )].sort()

  const finalData = subsidyData.filter(d =>
    d.HouseType.includes(data.HouseType) &&
    (d.Region === data.Region || d.Region === 'Bundesweit') &&
    (d.District === data.District || !d.District) &&
    (
      data.TypZuschuss && d.Type.includes('Zuschuss') ||
      data.TypKredit && d.Type.includes('Kredit')
    ) &&
    d.Measures?.some(element => data.Measures?.includes(element))
  )

  const filteredFinalData = finalData.filter(d => d?.Questions?.every(element => {
    const userAnswer = answers[element.Id]
    return (userAnswer === 'Unklar' || (userAnswer === 'Ja' && element.RequiredAnswer) || (userAnswer === 'Nein' && !element.RequiredAnswer))
  }))

  console.log(subsidyData)

  const openQuestionaire = () => {
    setQuestionnaireOpen(true)
    setQuestionnaireStep(0)
  }

  const handleSubmitReport = (e) => {
    e.preventDefault()
    setIsLoading(true)
    fetch('/api/subsidies', {
      method: 'POST',
      body: JSON.stringify({ data, answers, email })
    })
      .then(res => res.json())
      .then(res => {
        router.push(`/report?id=${res.id}&is_new=true`)
      })
      .catch(() => console.log('error')) // todo error handling
      .finally(() => setIsLoading(false))
  }

  return (
    <Layout
      title="Förderradar"
      description="todo"
      noindex={true} // todo
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
              {!questionnaireOpen && <Stepper
                active={active}
                onStepClick={setActive}
                size="14px"
                styles={{ separator: { marginInline: 0 }, stepIcon: { color: 'transparent' } }}
                allowNextStepsSelect={false}
              >
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Handelt es sich um eine Bestandsimmobilie oder einen Neubau?</Title>

                  <Flex wrap="wrap" gap="md">
                    <SelectButton name="HouseType" value="Bestand" onClick={selectOption} fullWidth>Bestand</SelectButton>
                    <SelectButton name="HouseType" value="Neubau" onClick={selectOption} fullWidth>Neubau</SelectButton>
                  </Flex>

                  <ButtonGroup {...{ data, setData, active, setActive }} />
                </Stepper.Step>
                <Stepper.Step>
                  <form onSubmit={handleSubmitNext}>
                    <Title order={2} size="h3" mb="lg">Welche Art der Förderung suchen Sie?</Title>
                    <CheckboxCard handleChange={() => setData({ ...data, TypZuschuss: !data.TypZuschuss })} value={data.TypZuschuss} title="Zuschuss" mb="lg" />
                    <CheckboxCard handleChange={() => setData({ ...data, TypKredit: !data.TypKredit })} value={data.TypKredit} title="Kredit" />

                    <ButtonGroup {...{ data, setData, active, setActive }} hasSubmit disabled={!data.TypZuschuss && !data.TypKredit} />
                  </form>
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Wo liegt die Immobilie oder wo planen Sie zu bauen?</Title>

                  <form onSubmit={handleSubmit}>
                    <Select
                      label="Bundesland"
                      data={bundeslaender}
                      required
                      mb="sm"
                      name="Region"
                      onChange={(value) => setData({ ...data, Region: value, District: null })}
                      value={data.Region}
                    />

                    <Select
                      label="Kreis/Landkreis (optional)"
                      data={districtData || []}
                      placeholder={!data.Region ? 'Zuerst Bundesland auswählen' : !districtData || !districtData.length ? 'Keine Kreise vorhanden' : 'Kreis auswählen'}
                      mb="sm"
                      name="District"
                      onChange={(value) => setData({ ...data, District: value })}
                      value={data.District}
                      disabled={!districtData || !districtData.length}
                      description="Für einige Bundesländer gibt es spezifische Förderungen einzelner Kreise/Landkreise."
                    />

                    <ButtonGroup active={active} setActive={setActive} hasSubmit disabled={!data.Region} />
                  </form>
                </Stepper.Step>
                <Stepper.Step>
                  <Title order={2} size="h3" mb="lg">Welche Maßnahmen planen Sie?</Title>

                  <Chip
                    checked={data.Measures?.length === measuresData.length}
                    onChange={() => data.Measures?.length === measuresData.length
                      ? setData({ ...data, Measures: [] })
                      : setData({ ...data, Measures: measuresData })
                    }
                    size="lg"
                    mb="md"
                    styles={{ label: { width: '100%', justifyContent: 'center' } }}
                  >
                    Alle auswählen
                  </Chip>

                  <form onSubmit={handleSubmit}>
                    <Flex gap="sm" wrap="wrap">
                      {measuresData.map((m) => (
                        <SelectChip key={m} value={m} {...{ data, setData }}>{m}</SelectChip>
                      ))}
                    </Flex>
                    <ButtonGroup {...{ data, setData, active, setActive }} hasSubmit disabled={(data.Measures || []).length === 0} />
                  </form>
                </Stepper.Step>
                <Stepper.Completed>
                  {/* TODO keine förderungen gefunden ? */}
                  <Title order={2} size="h3" mb="md">
                    Wir konnten {finalData.length} Förderungen für die eingestellten Kriterien finden.
                  </Title>
                  <Table mb="lg" size="sm" striped>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Deine Daten</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td>Förderungen für</Table.Td>
                        <Table.Td>{data.HouseType}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>Art der Förderung</Table.Td>
                        <Table.Td>{data.TypZuschuss && data.TypKredit ? 'Zuschuss & Kredit' : data.TypZuschuss ? 'Zuschuss' : 'Kredit'}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>Immobilienstandort</Table.Td>
                        <Table.Td>{data.Region}{data.District ? ` - ${data.District}` : ''}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>Zu Fördernde Maßnahmen</Table.Td>
                        <Table.Td>{data.Measures?.join(', ')}</Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>

                  <Text mb="lg">
                    Nun müssen wir nur noch prüfen, für welche Förderungen du die Voraussetzungen erfüllst.
                    Beantworte dazu bitte die Fragen zu den einzelnen Förderprogrammen.
                  </Text>

                  <Flex gap="md">
                    <Button variant="default" w="30%" onClick={() => setActive(active - 1)}>Zurück</Button>
                    <Button w="70%" onClick={() => openQuestionaire()}>Weiter zu den Fragen</Button>
                  </Flex>
                </Stepper.Completed>
              </Stepper>}

              {questionnaireOpen && <Stepper
                active={questionnaireStep}
                onStepClick={setQuestionnaireStep}
                size="14px"
                styles={{ separator: { marginInline: 0 }, stepIcon: { color: 'transparent' } }}
                allowNextStepsSelect={false}
              >
                {finalData.filter(q => q.Questions && q.Questions.length > 0).map((d, index) => <Stepper.Step key={`questionnaire-${d.Id}`}>
                  <Text fw="bold" mb="lg">Bitte beantworte folgende Fragen um zu überprüfen ob die Förderung für Dich zulässig ist.</Text>
                  <form onSubmit={e => handleSubmitQuestionnaire(e, d)}>
                    <Flex wrap="wrap" gap="lg" mb="xl">
                      {d.Questions.map((q) =>
                        <Radio.Group
                          key={`questionnaire-question-${d.Id}-${q.Id}`}
                          label={q.Question}
                          withAsterisk
                          value={answers[q.Id] || ''}
                          onChange={val => setAnswers({ ...answers, [q.Id]: val })}
                          required
                        >
                          <Group mt="xs">
                            <Radio value="Ja" label="Ja" />
                            <Radio value="Nein" label="Nein" />
                            <Radio value="Unklar" label="Keine Angabe" />
                          </Group>
                        </Radio.Group>
                      )}
                    </Flex>

                    <Flex gap="md" justify="space-between">
                      <Button variant="default" onClick={() => index > 0 ? setQuestionnaireStep(index - 1) : setQuestionnaireOpen(false)}>Zurück</Button>
                      <Button type="submit" loading={isLoading} disabled={d.Questions.some(q => !answers[q.Id])}>
                        Weiter
                      </Button>
                    </Flex>
                  </form>
                </Stepper.Step>)}

                <Stepper.Completed>
                  <Title order={2} size="h3" mb="md">
                    Du bist berechtigt {filteredFinalData.length} Förderungen zu erhalten.
                  </Title>
                  <Text mb="md" fs="italic">Erhalte jetzt deinen Report als PDF per E-Mail</Text>
                  <form onSubmit={handleSubmitReport}>
                    <TextInput
                      required
                      label="E-Mail Adresse"
                      placeholder="mustermann@example.com"
                      mb="xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <Flex gap="md">
                      <Button
                        variant="default" w="30%"
                        onClick={() => questionnaireStep === 0 ? setQuestionnaireOpen(false) : setQuestionnaireStep(questionnaireStep - 1)}
                      >Zurück</Button>
                      <Button w="70%" type="submit" loading={isLoading}>Report Erstellen</Button>
                    </Flex>
                  </form>
                </Stepper.Completed>
              </Stepper>}
            </Modal>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
}
