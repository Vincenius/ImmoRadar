import React, { useState, useEffect, act } from 'react';
import useSWR from "swr";
import { Text, Title, Flex, Box, Card, Table, NumberInput, rem, ActionIcon, Indicator, Divider, Button, Tooltip, ThemeIcon, Modal, TextInput, Pagination } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import ConfettiExplosion from 'react-confetti-explosion';
import { useCountUp } from 'react-countup';
import Layout from '@/components/Layout/Layout';
import { fetcher } from '@/utils/fetcher'
import SearchItem from '@/components/SearchItem/SearchItem';
import { IconCurrencyEuro, IconArrowRight, IconQuestionMark, IconBrandFacebook, IconBrandWhatsapp, IconBrandX, IconBrandTelegram } from '@tabler/icons-react';

const LeaderboardTable = ({ leaderboards, saveScore, username, setUsername, submitScoreLoading, disablePagination }) => {
  const defaultPlayerIndex = leaderboards.findIndex(player => player.newEntry) || leaderboards.findIndex(player => player.username === username);
  const defaultPage = defaultPlayerIndex !== -1 ? Math.ceil((defaultPlayerIndex + 1) / 5) : 1;
  const [activePage, setActivePage] = useState(defaultPage);
  const totalPages = Math.ceil(leaderboards.length / 5);
  let leaderboardPlace = 1;
  const confettiProps = {
    force: 0.6,
    duration: 2500,
    particleCount: 100,
    onComplete: () => setIsExploding(false),
  };
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    setActivePage(defaultPage)
  }, [defaultPage])

  const afterSaving = (e) => {
    setIsExploding(true)
    // todo set correct page index
  }

  return <>
    <Table striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th></Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Ergebnis</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        { isExploding && <ConfettiExplosion { ...confettiProps } /> }
        { leaderboards.sort((a, b) => b.score - a.score).map((player, index) => {
          let currentPlace = index + 1;

          // Check for previous player to determine if leaderboard place needs to be updated
          if (index === 0 || leaderboards[index - 1].score !== player.score) {
            leaderboardPlace = currentPlace;
          }

          if (index >= activePage * 5 || index < (activePage - 1) * 5) {
            return null
          }

          if (player.newEntry) {
            return <>
              <Table.Tr key={`leaderboard-${index}`}>
                <Table.Td>{leaderboardPlace}.</Table.Td>
                <Table.Td>
                  <form onSubmit={e => saveScore(e, afterSaving)}>
                    <Flex align="end">
                      <TextInput
                        label="Name"
                        required
                        placeholder="Dein Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={20}
                      >
                      </TextInput>
                        <ActionIcon
                          variant="filled" aria-label="Settings" h="36px" w="36px" type="submit"
                          loading={submitScoreLoading} disabled={submitScoreLoading}
                        >
                          <IconArrowRight style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </Flex>
                  </form>
                </Table.Td>
                <Table.Td>{player.score}</Table.Td>
              </Table.Tr>
            </>
          }
          
          return <Table.Tr key={`leaderboard-${index}`}>
            <Table.Td>{leaderboardPlace}.</Table.Td>
            <Table.Td>{player.username}</Table.Td>
            <Table.Td>{player.score}</Table.Td>
          </Table.Tr>
        }) }
      </Table.Tbody>
    </Table>
    { (totalPages > 1 && !disablePagination) && <Pagination mt="md" value={activePage} onChange={setActivePage} total={totalPages} /> }
  </>
}

const getShareText = (score) => `Ich habe gerade bei ImmoGuesser eine Punktzahl von ${score} erreicht! Kannst du die Mieten besser schätzen als ich? Probiere es aus:`

const ImmoGuesser = ({ data, url, slug }) => {
  const [opened, { open, close }] = useDisclosure(true);
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(1000)
  const [revealed, setRevealed] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [isExploding, setIsExploding] = useState(false)
  const [submitScoreLoading, setSubmitScoreLoading] = useState(false)
  const [showNewEntry, setShowNewEntry] = useState(false)

  const countUpRef = React.useRef(null);
  const [username, setUsername] = useLocalStorage({
    key: 'immo-guesser-user',
    defaultValue: '',
  });
  const { data: leaderboards = [], error, isLoading, mutate } = useSWR(`/api/immo-guesser/leaderboards`, fetcher);
  const { update } = useCountUp({
    ref: countUpRef,
    start: 1000,
    end: 1000,
    duration: 1.5,
  });
  const confettiProps = {
    force: 0.6,
    duration: 2500,
    particleCount: 100,
    onComplete: () => setIsExploding(false),
  };
  const eurIcon = <IconCurrencyEuro style={{ width: rem(20), height: rem(20) }} stroke={1.5} />;
  const handleSubmit = (e) => {
    e.preventDefault()
    setRevealed(true)
    const result = data[level].price.value > inputVal
      ? data[level].price.value - inputVal
      : inputVal - data[level].price.value
    const newScore = score - result

    if (result === 0) {
      setIsExploding(true)
    }

    update(newScore)
    setScore(newScore)

    if (level === 4) {
      setShowNewEntry(true)
      open()
    }
  }

  const goNext = () => {
    setRevealed(false)
    setLevel(level + 1)
    setInputVal('')
  }

  const restart = () => {
    setLevel(0)
    setRevealed(false)
    setScore(0)
  }

  const saveScore = (e, callback) => {
    e.preventDefault()

    setSubmitScoreLoading(true)
    
    fetch('/api/immo-guesser/leaderboards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score, username }),
    }).then(res => res.json()).then(async data => {
      setShowNewEntry(false)
      mutate([ ...leaderboards, { score, username } ])
      callback()
    }).finally(() => {
      setSubmitScoreLoading(false)
    })
  }

  return (
    <Layout
      title={`ImmoGuesser | Schätze die Miete der Wohnungen aus ${slug}`}
      description={`Teste dein Gespür für Mietpreise in ${slug}! In diesem kleinen Spiel bekommst du fünf verschiedene Wohnungen aus ${slug} angezeigt. Deine Aufgabe: Schätze, wie viel die Wohnung kostet.`}
      image="https://immoradar.xyz/immo-guesser.jpg"
    >
      <Title order={1} mt="xl" mb="md">ImmoGuesser | Schätze die Miete der Wohnungen aus {slug}</Title>
      <Text mb="xl">Teste dein Gespür für Mietpreise! In diesem kleinen Spiel bekommst du fünf verschiedene Wohnungen angezeigt. Deine Aufgabe: Schätze, wie viel die Wohnung kostet.</Text>

      <Flex gap={{ base: '0', md: 'md'}} mb="xl" direction={{ base: 'column', md: 'row' }}>
        <Box w="100%">
          <Indicator position="top-start" radius="md" size={30} label={`${level + 1} / 5`}>
            <SearchItem item={data[level]} hidePrice={true} hideLink={!revealed} />
          </Indicator>

          <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
            <Flex gap={{ base: 'xs', md: 'xl'}} direction={{ base: 'column', md: 'row' }}>
              <form onSubmit={handleSubmit}>
                <Flex align="end">
                  <NumberInput
                    required
                    rightSection={eurIcon}
                    label="Tipp Abgeben"
                    placeholder="550"
                    mr="sm"
                    value={inputVal}
                    onChange={(val) => setInputVal(val)}
                    disabled={revealed}
                    maw={{ base: '100%', md: 120 }}
                  />
                  <ActionIcon variant="filled" aria-label="Settings" h="36px" w="36px" type="submit" disabled={revealed}>
                    <IconArrowRight style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                </Flex>
              </form>
              <Divider orientation="vertical" />
              <Box>
                <Text fw="500" size="sm" mb="4px">Kaltmiete</Text>
                {isExploding && <ConfettiExplosion { ...confettiProps } />}

                <Text fw="700" size="xl" ref={countUpRef}>
                  {revealed ? `${data[level].price.value} €` : '??? €'}
                </Text>
              </Box>
              <Divider orientation="vertical" />
              <Box>
                <Flex gap="sm" mb="4px">
                  <Text fw="500" size="sm">Punktzahl</Text>
                  {isExploding && <ConfettiExplosion { ...confettiProps } />}
                  <Tooltip label="Differenz zwischen deinem Tipp und dem Preis wird subtrahiert">
                    <ThemeIcon variant="outline" size="xs" color="cyan.9" radius="xl">
                      <IconQuestionMark style={{ width: '70%', height: '70%' }} />
                    </ThemeIcon>
                  </Tooltip>
                </Flex>

                <Text fw="700" size="xl" c={score > 0 ? 'teal.9' : score === 0 ? 'yellow.9' : 'red.9'} ref={countUpRef}>0</Text>
              </Box>
              <Divider orientation="vertical" />
              { level !== 4 && <Button disabled={!revealed} mt="sm" onClick={goNext}>Weiter</Button> }
              { level === 4 && <Button disabled={!revealed} mt="sm" onClick={restart}>Erneut versuchen!</Button> }
            </Flex>
          </Card>
        </Box>

        <Box miw="250px">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={2} size="h4" mb="sm" align="center">Rangliste</Title>
            <LeaderboardTable leaderboards={leaderboards} />
          </Card>
        </Box>
      </Flex>

      {/* todo more cities */}

      <Modal opened={opened} onClose={close} title="Glückwunsch!">
        <Text>Du hast das Spiel mit <b>{ score }</b> Punkten abgeschlossen.</Text>

        <Text mb="sm">Trage dich in die Rangliste ein:</Text>
        <LeaderboardTable
          disablePagination={true}
          leaderboards={[
            ...leaderboards,
            showNewEntry && { username, score, newEntry: true },
          ].filter(Boolean)}
          saveScore={saveScore}
          submitScoreLoading={submitScoreLoading}
          username={username}
          setUsername={setUsername}
        />

        <Divider my="md" />

        <Text mb="xs" fs="italic">Ergebnis Teilen</Text>
        <Flex gap="sm">
          <ActionIcon variant="filled" aria-label="Facebook" color="#1877F2" href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} component="a" target="_blank">
            <IconBrandFacebook style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="filled" aria-label="X / Twitter" color="#000000" href={`https://twitter.com/intent/tweet?url=${url}&text=${getShareText(score)}`} component="a" target="_blank">
            <IconBrandX style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="filled" aria-label="WhatsApp" color="#25D366" href={`https://wa.me/?text=${getShareText(score)} ${url}`} component="a" target="_blank">
            <IconBrandWhatsapp style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="filled" aria-label="WhatsApp" color="#26A5E4" href={`https://telegram.me/share/url?url=${url}&text=${getShareText(score)}`} component="a" target="_blank">
            <IconBrandTelegram style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Flex>
      </Modal>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const [data] = await Promise.all([
    fetcher(`${process.env.BASE_URL}/api/immo-guesser/estates?q=${slug}`),
  ]);

  return {
    props: {
      data,
      url: `${process.env.BASE_URL}/blog/immo-guesser/${slug}`,
      slug,
    },
  };
}

export default ImmoGuesser;