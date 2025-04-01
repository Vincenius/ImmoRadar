import { useState } from 'react';
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { Flex, Text, Group, Button, Title, Box, TextInput, Stepper, Table, Chip, Select, Radio, Card, Checkbox } from '@mantine/core';
import { IconHome, IconProgressHelp, IconBackhoe } from '@tabler/icons-react'
import SelectButton from '@/components/Inputs/SelectButton';
import Layout from '@/components/Layout/Layout'
import { bundeslaender } from '@/utils/bundeslaender'
import CheckboxCard from '@/components/Inputs/CheckboxCard';
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
  const [active, setActive] = useState(0);
  const [questionnaireStep, setQuestionnaireStep] = useState(0);
  const [checkStep, setCheckStep] = useState(0);
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

  const openQuestionaire = () => {
    setCheckStep(1)
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
      <Stepper
        my="3em"
        active={checkStep}
        onStepClick={setCheckStep}
        size="xl"
        allowNextStepsSelect={false}
      >
        <Stepper.Step icon={<IconHome size={24} />}>
          <Card my="xl" p="0">
            <Stepper
              active={active}
              onStepClick={setActive}
              size="1px"
              styles={{ separator: { marginInline: 0 }, stepIcon: { color: 'transparent' } }}
              allowNextStepsSelect={false}
            >
              <Stepper.Step>
                <Box p="xl">
                  <Title order={2} size="h3" mb="xl" ta="center">Handelt es sich um eine Bestandsimmobilie oder einen Neubau?</Title>

                  <Flex gap="md">
                    <SelectButton name="HouseType" value="Bestand" onClick={selectOption} fullWidth isMultiLine={true}>
                      <Flex direction="column" gap="sm" align="center">
                        <IconHome size="2em" />
                        <Text fw="600" size="lg">Bestand</Text>
                      </Flex>
                    </SelectButton>
                    <SelectButton name="HouseType" value="Neubau" onClick={selectOption} fullWidth isMultiLine={true}>
                      <Flex direction="column" gap="sm" align="center">
                        <IconBackhoe size="2em" />
                        <Text fw="600" size="lg">Neubau</Text>
                      </Flex>
                    </SelectButton>
                  </Flex>

                  <ButtonGroup {...{ data, setData, active, setActive }} />
                </Box>
              </Stepper.Step>
              <Stepper.Step>
                <Box p="xl">
                  <form onSubmit={handleSubmitNext}>
                    <Title order={2} size="h3" mb="xl" ta="center">Welche Art der Förderung suchen Sie?</Title>
                    <Flex gap="md" direction={{ base: 'column', xs: 'row' }}>
                      <CheckboxCard handleChange={() => setData({ ...data, TypZuschuss: !data.TypZuschuss })} value={data.TypZuschuss} title="Zuschuss" />
                      <CheckboxCard handleChange={() => setData({ ...data, TypKredit: !data.TypKredit })} value={data.TypKredit} title="Kredit" />
                    </Flex>
                    <ButtonGroup {...{ data, setData, active, setActive }} hasSubmit disabled={!data.TypZuschuss && !data.TypKredit} />
                  </form>
                </Box>
              </Stepper.Step>
              <Stepper.Step>
                <Box p="xl">
                  <Title order={2} size="h3" mb="xl" ta="center">Wo liegt die Immobilie oder wo planen Sie zu bauen?</Title>

                  <form onSubmit={handleSubmit}>
                    <Flex gap="md" direction={{ base: 'column', xs: 'row' }} align="flex-start">
                      <Select
                        label="Bundesland"
                        data={bundeslaender}
                        required
                        mb="sm"
                        name="Region"
                        onChange={(value) => setData({ ...data, Region: value, District: null })}
                        value={data.Region}
                        size="lg"
                        w="100%"
                      />

                      <Box w="100%">
                        <Select
                          label="Kreis/Landkreis (optional)"
                          data={districtData || []}
                          placeholder={!data.Region ? 'Zuerst Bundesland auswählen' : !districtData || !districtData.length ? 'Keine Kreise vorhanden' : 'Kreis auswählen'}
                          mb="xs"
                          name="District"
                          onChange={(value) => setData({ ...data, District: value })}
                          value={data.District}
                          disabled={!districtData || !districtData.length}
                          size="lg"
                        />
                        <Text c="gray.7" size="sm">Für einige Bundesländer gibt es spezifische Förderungen einzelner Kreise/Landkreise.</Text>
                      </Box>
                    </Flex>

                    <ButtonGroup active={active} setActive={setActive} hasSubmit disabled={!data.Region} />
                  </form>
                </Box>
              </Stepper.Step>
              <Stepper.Step>
                <Box p="xl">
                  <Title order={2} size="h3" mb="xl" ta="center">Welche Maßnahmen planen Sie?</Title>

                  <Chip
                    checked={data.Measures?.length === measuresData.length}
                    onChange={() => data.Measures?.length === measuresData.length
                      ? setData({ ...data, Measures: [] })
                      : setData({ ...data, Measures: measuresData })
                    }
                    size="lg"
                    mb="md"
                    radius="sm"
                    styles={{ label: { width: '100%', justifyContent: 'center' } }}
                  >
                    Alle auswählen
                  </Chip>

                  <form onSubmit={handleSubmit}>
                    <Flex gap="sm" wrap="wrap">
                      {measuresData.map((m) => (
                        <SelectChip radius="sm" key={m} value={m} {...{ data, setData }}>{m}</SelectChip>
                      ))}
                    </Flex>
                    <ButtonGroup {...{ data, setData, active, setActive }} hasSubmit disabled={(data.Measures || []).length === 0} />
                  </form>
                </Box>
              </Stepper.Step>
              <Stepper.Step>
                <Box p="xl">
                  <Title order={2} size="h3" mb="xl" ta="center">
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

                  <Text mb="lg" fs="italic">
                    Nun müssen wir nur noch prüfen, für welche Förderungen du die Voraussetzungen erfüllst.<br />
                    Beantworte dazu bitte die Fragen zu den einzelnen Förderprogrammen.
                  </Text>

                  <Flex gap="md">
                    <Button variant="default" w="30%" onClick={() => setActive(active - 1)}>Zurück</Button>
                    <Button w="70%" onClick={() => openQuestionaire()}>Weiter zu den Fragen</Button>
                  </Flex>
                </Box>
              </Stepper.Step>
            </Stepper>
          </Card>
        </Stepper.Step>
        <Stepper.Step icon={<IconProgressHelp size={24} />}>
          <Card my="xl" p="0">
            <Stepper
              active={questionnaireStep}
              onStepClick={setQuestionnaireStep}
              size="1px"
              styles={{ separator: { marginInline: 0 }, stepIcon: { color: 'transparent' } }}
              allowNextStepsSelect={false}
            >
              {finalData.filter(q => q.Questions && q.Questions.length > 0).map((d, index) => <Stepper.Step key={`questionnaire-${d.Id}`}>
                <Box p="xl">
                  <Title order={2} size="h3" mb="xl" ta="center">{d.Name}</Title>
                  <Text fw="bold" mb="lg" ta="center">Bitte beantworte folgende Fragen um zu überprüfen ob die Förderung für Dich zulässig ist.</Text>
                  {/* todo timeline https://mantine.dev/core/timeline/ */}
                  <form onSubmit={e => handleSubmitQuestionnaire(e, d)}>
                    <Table mb="lg" size="sm" striped display={{ base: 'none', xs: 'table' }}>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th w="70%">Frage</Table.Th>
                          <Table.Th w="10%">Ja</Table.Th>
                          <Table.Th w="10%">Nein</Table.Th>
                          <Table.Th w="10%">Keine Angabe</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {d.Questions.map((q) =>
                          <Table.Tr key={`questionnaire-question-${d.Id}-${q.Id}`}>
                            <Table.Td><Text>{q.Question}</Text></Table.Td>
                            <Table.Td><Checkbox checked={answers[q.Id] === 'Ja'} onChange={e => setAnswers({ ...answers, [q.Id]: e.target.checked ? 'Ja' : '' })} /></Table.Td>
                            <Table.Td><Checkbox checked={answers[q.Id] === 'Nein'} onChange={e => setAnswers({ ...answers, [q.Id]: e.target.checked ? 'Nein' : '' })} /></Table.Td>
                            <Table.Td><Checkbox checked={answers[q.Id] === 'Unklar'} onChange={e => setAnswers({ ...answers, [q.Id]: e.target.checked ? 'Unklar' : '' })} /></Table.Td>
                          </Table.Tr>
                        )}
                      </Table.Tbody>
                    </Table>

                    <Flex wrap="wrap" gap="lg" mb="xl" display={{ base: 'flex', xs: 'none' }}>
                      {d.Questions.map((q) =>
                        <Box key={`questionnaire-question-${d.Id}-${q.Id}`}>
                          <Text mb="sm" fw="500">{q.Question}</Text>
                          <Flex gap="sm">
                            <Radio.Card
                              radius="sm"
                              onClick={() => setAnswers({ ...answers, [q.Id]: 'Ja' })}
                              style={{
                                borderColor: answers[q.Id] === 'Ja' ? 'var(--mantine-primary-color-filled)' : '',
                                borderWidth: '2px',
                              }}
                            >
                              <Group wrap="nowrap" p="xs" justify="center">
                                <Text ta="center">Ja</Text>
                              </Group>
                            </Radio.Card>
                            <Radio.Card
                              radius="sm"
                              onClick={() => setAnswers({ ...answers, [q.Id]: 'Nein' })}
                              style={{
                                borderColor: answers[q.Id] === 'Nein' ? 'var(--mantine-primary-color-filled)' : '',
                                borderWidth: '2px',
                              }}
                            >
                              <Group wrap="nowrap" p="xs" justify="center">
                                <Text ta="center">Nein</Text>
                              </Group>
                            </Radio.Card>
                            <Radio.Card
                              radius="sm"
                              onClick={() => setAnswers({ ...answers, [q.Id]: 'Unklar' })}
                              style={{
                                borderColor: answers[q.Id] === 'Unklar' ? 'var(--mantine-primary-color-filled)' : '',
                                borderWidth: '2px',
                              }}
                            >
                              <Group wrap="nowrap" p="xs" justify="center">
                                <Text ta="center">Keine Angabe</Text>
                              </Group>
                            </Radio.Card>
                          </Flex>

                        </Box>
                      )}
                    </Flex>

                    <Flex gap="md" justify="space-between">
                      <Button variant="default" onClick={() => index > 0 ? setQuestionnaireStep(index - 1) : setCheckStep(0)}>Zurück</Button>
                      <Button type="submit" loading={isLoading} disabled={d.Questions.some(q => !answers[q.Id])}>
                        Weiter
                      </Button>
                    </Flex>
                  </form>
                </Box>
              </Stepper.Step>)}

              <Stepper.Completed>
                {/* todo 0 förderungen */}
                <Box p="xl">
                  <Title order={2} size="h3" mb="xl" align="center">
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
                        onClick={() => questionnaireStep === 0 ? setCheckStep(0) : setQuestionnaireStep(questionnaireStep - 1)}
                      >Zurück</Button>
                      <Button w="70%" type="submit" loading={isLoading}>Report Erstellen</Button>
                    </Flex>
                  </form>
                </Box>
              </Stepper.Completed>
            </Stepper>
          </Card>
        </Stepper.Step>
      </Stepper>
    </Layout>
  );
}
