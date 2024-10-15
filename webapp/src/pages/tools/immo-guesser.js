import React, { useState } from 'react';
import useSWR from "swr";
import { Text, Title, Flex, Box, Card, Table, NumberInput, rem, ActionIcon, Indicator, Divider, Button, Tooltip, ThemeIcon, Modal, TextInput } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import ConfettiExplosion from 'react-confetti-explosion';
import { useCountUp } from 'react-countup';
import Layout from '@/components/Layout/Layout';
import { fetcher } from '@/utils/fetcher'
import SearchItem from '@/components/SearchItem/SearchItem';
import { IconCurrencyEuro, IconArrowRight, IconQuestionMark } from '@tabler/icons-react';

// todo mobile
// todo leaderboard logic
// todo pagination
// todo pop up logic
// todo local storage name
// confetti on name submit
// todo share icon
// todo meta stuff
// todo cors

const ImmoGuesser = ({ data }) => {
  const [opened, { open, close }] = useDisclosure(true);
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(1000)
  const [revealed, setRevealed] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [isExploding, setIsExploding] = useState(false)
  const countUpRef = React.useRef(null);
  const [username, setUsername] = useLocalStorage({
    key: 'immo-guesser-user',
    defaultValue: '',
  });
  const { data: leaderboards, error, isLoading } = useSWR(`/api/immo-guesser/leaderboards`, fetcher);
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

  const saveScore = (e) => {
    e.preventDefault()
    console.log({ score, newUsername })
  }

  return (
    <Layout
      title="ImmoGuesser | Schätze die Miete der Wohnungen"
      description="Teste dein Gespür für Mietpreise! In diesem kleinen Spiel bekommst du fünf verschiedene Wohnungen angezeigt. Deine Aufgabe: Schätze, wie viel die Wohnung kostet."
    >
      <Title order={1} mt="xl" mb="md">ImmoGuesser | Schätze die Miete der Wohnungen</Title>
      <Text mb="xl">Teste dein Gespür für Mietpreise! In diesem kleinen Spiel bekommst du fünf verschiedene Wohnungen angezeigt. Deine Aufgabe: Schätze, wie viel die Wohnung kostet.</Text>

      <Flex gap="md" mb="xl">
        <Box w="100%">
          <Indicator position="top-start" radius="md" size={30} label={`${level + 1} / 5`}>
            <SearchItem item={data[level]} hidePrice={true} hideLink={!revealed} />
          </Indicator>

          <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
            <Flex gap="xl">
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
                    maw={120}
                  />
                  <ActionIcon variant="filled" aria-label="Settings" h="36px" w="36px" type="submit" disabled={revealed}>
                    <IconArrowRight style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                </Flex>
              </form>
              <Divider orientation="vertical" />
              <Box>
                <Text fw="500" size="sm" mb="4px">Preis</Text>
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
            {/* todo change name if name is set */}

            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th></Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Ergebnis</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>1.</Table.Td>
                  <Table.Td>Vincent</Table.Td>
                  <Table.Td>234</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>2.</Table.Td>
                  <Table.Td>Vincent</Table.Td>
                  <Table.Td>234</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>3.</Table.Td>
                  <Table.Td>Vincent</Table.Td>
                  <Table.Td>234</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Card>
        </Box>
      </Flex>

      <Modal opened={opened} onClose={close} title="Glückwunsch!">
        <Text>Du hast das Spiel mit <b>{ score }</b> Punkten abgeschlossen.</Text>
        {/* Damit bist du auf Platz TODO unser heutigen und Platz TODO des gesamten Rankings.
        wenn kein name: Trage deinen Namen ein um das Ergebnis zu speichern. */}

        {!username && <>
          <Text mb="sm">Trage dich in die Rangliste ein:</Text>
          {/* todo show new leaderboard */}
          <form onSubmit={saveScore}>
            <TextInput
              mb="sm"
              label="Name"
              required
              placeholder="Dein Name"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}></TextInput>
            <Button mb="md" type="submit">Speichern</Button>
          </form>
        </>}

        <Text>TODO Ergebnis Teilen</Text>
      </Modal>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { query } = context;
  const { q = '' } = query;
  const [data] = await Promise.all([
    fetcher(`${process.env.BASE_URL}/api/immo-guesser/estates?q=${q}`),
  ]);

  return {
    props: {
      q,
      data,
    },
  };
}

export default ImmoGuesser;