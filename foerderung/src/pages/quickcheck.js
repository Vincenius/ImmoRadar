import { useState } from "react";
import { useRouter } from 'next/router'
import Layout from "@/components/Layout/Layout";
import { Box, Button, Card, Flex, NumberFormatter, Popover, Stepper, Timeline, Title, Text, Table } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import Link from "next/link";
import ResultTable from "@/components/ResultTable/ResultTable";

export async function getServerSideProps({ req, res, resolvedUrl }) {
  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');
  const baseUrl = process.env.BASE_URL

  if (!id) {
    return {
      redirect: {
        destination: '/foerdercheck',
        permanent: false,
      },
    };
  }

  const data = await fetch(`${baseUrl}/api/subsidies?id=${id}&ignoreQuestions=true`, {
    method: 'GET',
    headers: {
      'x-api-key': process.env.API_KEY
    }
  }).then(res => res.json())

  return {
    props: { data, baseUrl, id },
  };
}


export default function Report({ data, baseUrl, id }) {
  const router = useRouter();
  const { user, subsidies } = data
  const variant = user?.Variant

  const [questionnaireStep, setQuestionnaireStep] = useState(0)
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [falseAnswer, setFalseAnswer] = useState(null)
  const [answers, setAnswers] = useState({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const allSubsidies = subsidies
    .filter(q => q.Questions && q.Questions.length > 0 && !q.Type.includes('Kredit'))
    .map(q => ({
      ...q,
      Amount: user.Measures.reduce((acc, curr) => {
        return acc + q.FundingDetails[curr]
      }, 0)
    }))
  const filteredSubsidies = allSubsidies.filter(d => d?.Questions?.every(element => {
    const userAnswer = answers[element.Id]
    return d.Type.includes('Kredit') || (userAnswer === 'Unklar' || (userAnswer === 'Ja' && element.RequiredAnswer) || (userAnswer === 'Nein' && !element.RequiredAnswer))
  }))
  const allQuestions = allSubsidies.map(d => d.Questions).flat().filter(Boolean)

  const nextQuestionaireStep = async () => {
    const nextStep = questionnaireStep + 1

    fetch('/api/answers', {
      method: 'POST',
      body: JSON.stringify({ id, answers })
    })
    // todo set default ansers from previously filled

    setQuestionnaireStep(nextStep)
    setActiveQuestion(0)
    setFalseAnswer(null)
  }

  const prevQuestionaireStep = () => {
    if (questionnaireStep === 0) {
      router.push(`/report?id=${id}`)
    } else {
      let initQuestion = 0
      let initFalseAnswer = null

      allSubsidies[questionnaireStep - 1].Questions.forEach(q => {
        if (answers[q.Id] === 'Unklar' || answers[q.Id] === 'Ja' && q.RequiredAnswer || answers[q.Id] === 'Nein' && !q.RequiredAnswer) {
          initQuestion++
        } else if (answers[q.Id] === 'Ja' && !q.RequiredAnswer || answers[q.Id] === 'Nein' && q.RequiredAnswer) {
          initFalseAnswer = initQuestion
        }
      })

      setQuestionnaireStep(questionnaireStep - 1)
      setActiveQuestion(initQuestion)
      setFalseAnswer(initFalseAnswer)
    }
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

  const sendPdf = () => {
    setPdfLoading(true)
    fetch('/api/pdf', {
      method: 'POST',
      body: JSON.stringify({ id })
    })
      .then(() => {
        // todo show pdf success
        setPdfSuccess(true)
      })
      .catch(error => {
        // todo show pdf error
      })
      .finally(() => setPdfLoading(false))
  }

  return <Layout title="Quickcheck für deine Förderungen">
    <Card my="xl" p="0">
      <Stepper
        active={questionnaireStep}
        onStepClick={setQuestionnaireStep}
        size="1px"
        styles={{ separator: { marginInline: 0 }, stepIcon: { color: 'transparent' } }}
        allowNextStepsSelect={false}
      >
        {allSubsidies && allSubsidies.map((d, index) => <Stepper.Step key={`questionnaire-${d.Id}`}>
          <Box p="xl">
            <Text ta="center" fs="italic">Förderung {index + 1}. mit einer Fördersumme von <NumberFormatter suffix="€" value={d.Amount} thousandSeparator="." decimalSeparator="," decimalScale={0} /></Text>
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
                  <Flex gap="md">
                    <Text mt={4} mb="md">{q.Question}</Text>
                    {q.Question.Infotext && <Popover width={200} position="bottom" withArrow shadow="md">
                      <Popover.Target>
                        <ThemeIcon variant="outline" radius="xl" size="xs" mt="0.45em" style={{ cursor: 'pointer' }}>
                          <IconQuestionMark style={{ width: '80%', height: '80%' }} />
                        </ThemeIcon>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Text size="xs">{q.Question.Infotext}</Text>
                      </Popover.Dropdown>
                    </Popover>}
                  </Flex>

                  <Flex gap="md" direction={{ base: "column", xs: "row" }}>
                    <Button variant="outline" onClick={() => answerQuestion(q.Id, 'Ja')}>Ja</Button>
                    <Button variant="outline" onClick={() => answerQuestion(q.Id, 'Nein')}>Nein</Button>
                    <Button variant="outline" onClick={() => answerQuestion(q.Id, 'Unklar')}>Frage Überspringen</Button>
                  </Flex>
                </>}
                {falseAnswer === i && <>
                  <Text mb="md">Du erfüllst leider nicht die Voraussetzungen für diese Förderung.</Text>
                  <Flex gap="md">
                    <Button variant="default" onClick={() => setFalseAnswer(null)}>Frage erneut beantworten</Button>
                  </Flex>
                </>}
              </Timeline.Item>)}
            </Timeline>

            {activeQuestion === d.Questions.length && falseAnswer === null && <Box mt="md">
              <Text mb="md">Du erfüllst die Voraussetzungen für diese Förderung.</Text>
            </Box>}

            {/* todo is loading */}
            <Flex gap="md" mt="xl">
              <Button variant="outline" onClick={prevQuestionaireStep}>{index === 0 ? 'Zurück' : 'Vorherige Förderung'}</Button>
              <Button onClick={nextQuestionaireStep} variant={falseAnswer !== null || activeQuestion === d.Questions.length ? 'filled' : 'outline'}>
                {(falseAnswer !== null || activeQuestion === d.Questions.length)
                  ? allSubsidies.length === index + 1 ? 'Weiter zum Ergebnis' : 'Weiter zur nächsten Förderung'
                  : 'Förderung Überspringen'
                }
              </Button>
            </Flex>
          </Box>
        </Stepper.Step>)}

        <Stepper.Completed>
          <Box p="xl">
            {filteredSubsidies.length > 0 && <>
              <ResultTable data={filteredSubsidies} showType={user.TypZuschuss && user.TypKredit} measures={user.Measures} />
              <Flex mb="xl" gap="md">
                <Button component={Link} href={`/report?id=${id}`}>Zum Report</Button>
                <Button variant="outline" onClick={sendPdf} loading={pdfLoading} disabled={pdfSuccess}>PDF erneut per Email senden</Button>
              </Flex>
              {pdfSuccess && <Text c="green.9" mb="xl">Die PDF wurde erfolgreich per Email versendet.</Text>}
            </>}

            {filteredSubsidies.length === 0 && <Box mb="xl" >
              <Title order={2} size="h3" mb="xl" ta="center" textWrap="balance">
                Basierend auf deinen Antworten kannst leider keine Förderungen erhalten.
              </Title>

              <Button component={Link} href={`/report?id=${id}`}>Zum Report</Button>
            </Box>}

            <Button variant="outline" onClick={prevQuestionaireStep}>Zurück</Button>
          </Box>
        </Stepper.Completed>
      </Stepper>
    </Card>
  </Layout>
}