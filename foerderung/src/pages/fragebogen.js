      {/* Questionnaire */}
      {/* <Card my="xl" p="0">
        <Stepper
          active={questionnaireStep}
          onStepClick={setQuestionnaireStep}
          size="1px"
          styles={{ separator: { marginInline: 0 }, stepIcon: { color: 'transparent' } }}
          allowNextStepsSelect={false}
        >
          {!skipQuestions && finalDataQuestions.map((d, index) => <Stepper.Step key={`questionnaire-${d.Id}`}>
            <Box p="xl">
              <Title order={2} size="h3" mb="xl" ta="center">Förderung {index + 1}. mit einer Fördersumme von <NumberFormatter suffix="€" value={d.Amount} thousandSeparator="." decimalSeparator="," decimalScale={0} /></Title>
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

              <Button mt="lg" variant="outline" onClick={prevQuestionaireStep}>{index === 0 ? 'Zurück' : 'Vorherige Förderung'}</Button>
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
              {!isFreePlan && <>
                {!skipQuestions && <Title order={2} size="h3" mb="xl" align="center" textWrap="balance">
                  Du bist berechtigt {filteredFinalData.length} Förderungen mit einer maximalen Fördersumme von <NumberFormatter suffix="€" value={filteredFinalDataAmount} thousandSeparator="." decimalSeparator="," decimalScale={0} /> zu erhalten.
                </Title>}
                {skipQuestions && <Title order={2} size="h3" mb="xl" align="center" textWrap="balance">
                  Für deine Auswahl gibt es {filteredFinalData.length} Förderungen mit einer maximalen Fördersumme von <NumberFormatter suffix="€" value={filteredFinalDataAmount} thousandSeparator="." decimalSeparator="," decimalScale={0} />.
                </Title>}
                <Pricing
                  showFree={true}
                  CtaFree={<Button mt="lg" variant="outline" onClick={() => usePlan('free')} loading={paymentLoading}>Kostenlos testen</Button>}
                  CtaPremium={<Button mt="lg" variant="filled" onClick={() => usePlan('premium')} loading={paymentLoading}>Premium kaufen</Button>}
                  CtaProfessional={<Button mt="lg" variant="outline" onClick={() => usePlan('professional')} loading={paymentLoading}>Professional kaufen</Button>}
                />

                <Button
                  variant="default" w="30%"
                  onClick={() => questionnaireStep === 0 ? setCheckStep(0) : setQuestionnaireStep(questionnaireStep - 1)}
                >Zurück</Button>
              </>}

              {isFreePlan && <>
                <Title order={2} size="h3" mb="xl" align="center" textWrap="balance">
                  Erhalte jetzt deinen kostenlosen Report als PDF per E-Mail
                </Title>
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
                      onClick={() => setIsFreePlan(false)}
                    >Zurück</Button>
                    <Button w="70%" type="submit" loading={isLoading}>Report Erstellen</Button>
                  </Flex>
                </form>
              </>}
            </Box>}
          </Stepper.Completed>
        </Stepper>
      </Card> */}