import { useState } from 'react';
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { Flex, Text, Group, Button, Title, Box, TextInput, Stepper, Table, Chip, Select, Radio, Card, Checkbox, Timeline } from '@mantine/core';
import { IconHome, IconProgressHelp, IconBackhoe, IconCheck, IconX } from '@tabler/icons-react'
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
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [falseAnswer, setFalseAnswer] = useState(null);
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

  const nextQuestionaireStep = () => {
    setQuestionnaireStep(questionnaireStep + 1)
    setActiveQuestion(0)
    setFalseAnswer(null)
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
    return d.Type.includes('Kredit') || (userAnswer === 'Unklar' || (userAnswer === 'Ja' && element.RequiredAnswer) || (userAnswer === 'Nein' && !element.RequiredAnswer))
  }))

  const allQuestions = finalData.map(d => d.Questions).flat().filter(Boolean)

  const openQuestionaire = () => {
    setCheckStep(1)
    setQuestionnaireStep(0)
  }

  const answerQuestion = (id, answer) => {
    const question = allQuestions.find(q => q.Id === id)
    const isWrongAnswer = answer !== 'Unklar' && (answer === 'Ja' && !question.RequiredAnswer || answer === 'Nein' && question.RequiredAnswer)
    setAnswers({ ...answers, [id]: answer })

    if (isWrongAnswer) {
      setFalseAnswer(activeQuestion)
    } else {
      setActiveQuestion(activeQuestion + 1)
    }
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
              {finalData.filter(q => q.Questions && q.Questions.length > 0 && !q.Type.includes('Kredit')).map((d, index) => <Stepper.Step key={`questionnaire-${d.Id}`}>
                <Box p="xl">
                  <Title order={2} size="h3" mb="xl" ta="center">{d.Name}</Title>
                  <Text fw="bold" mb="lg">Bitte beantworte folgende Fragen um zu überprüfen ob die Förderung für Dich zulässig ist.</Text>

                  <Timeline active={activeQuestion} bulletSize={24} lineWidth={2}>
                    {d.Questions.map((q, i) => <Timeline.Item color={falseAnswer === i ? 'red.9' : ''}
                      bullet={i < activeQuestion
                        ? <IconCheck size={24} onClick={() => setActiveQuestion(i)} style={{ cursor: 'pointer' }} />
                        : falseAnswer === i
                          ? <IconX size={24} onClick={() => setActiveQuestion(i)} style={{ cursor: 'pointer' }} />
                          : (i + 1)}
                      key={`question-${i}`}
                      lineVariant={i <= activeQuestion ? 'solid' : 'dashed'}
                    >
                      <Text c="dimmed" size="sm">Frage {i + 1} / {d.Questions.length}</Text>
                      {activeQuestion === i && falseAnswer !== i && <>
                        <Text mt={4} mb="md">{q.Question}</Text>

                        <Flex gap="md" direction={{ base: "column", xs: "row" }}>
                          <Button variant="outline" onClick={() => answerQuestion(q.Id, 'Ja')}>Ja</Button>
                          <Button variant="outline" onClick={() => answerQuestion(q.Id, 'Nein')}>Nein</Button>
                          <Button variant="outline" onClick={() => answerQuestion(q.Id, 'Unklar')}>Frage Überspringen</Button>
                        </Flex>
                      </>}
                      {falseAnswer === i && <>
                        <Text mb="md">Du erfüllst leider nicht die Voraussetzungen für diese Förderung.</Text>
                        <Flex gap="md">
                          <Button variant="default" onClick={() => setFalseAnswer(null)}>Zurück</Button>
                          <Button variant="outline" onClick={() => nextQuestionaireStep()}>
                            {finalData.length === index + 1 ? 'Weiter zum Ergebnis' : 'Weiter zur nächsten Förderung'}
                          </Button>
                        </Flex>
                      </>}
                    </Timeline.Item>)}
                  </Timeline>

                  {activeQuestion === d.Questions.length && falseAnswer === null && <Box mt="md">
                    <Text mb="md">Du erfüllst die Voraussetzungen für diese Förderung.</Text>
                    <Button onClick={() => nextQuestionaireStep()}>
                      {finalData.length === index + 1 ? 'Weiter zum Ergebnis' : 'Weiter zur nächsten Förderung'}
                    </Button>
                  </Box>}
                </Box>
              </Stepper.Step>)}

              <Stepper.Completed>
                {filteredFinalData.length === 0 && <Box p="xl">
                  <Title order={2} size="h3" mb="xl" align="center">
                    Es wurden leider keine Förderungen für deine Eingaben gefunden.
                  </Title>
                  <Flex justify="center">
                    <Button
                      variant="default" w="30%"
                      onClick={() => questionnaireStep === 0 ? setCheckStep(0) : setQuestionnaireStep(questionnaireStep - 1)}
                    >Zurück</Button>
                  </Flex>
                </Box>}
                {filteredFinalData.length > 0 && <Box p="xl">
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
                </Box>}
              </Stepper.Completed>
            </Stepper>
          </Card>
        </Stepper.Step>
      </Stepper>
    </Layout>
  );
}
