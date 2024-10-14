import React, { useState } from 'react';
import { Text, Title, Flex, Box, Card, Table, NumberInput, rem, ActionIcon, Indicator, Divider, Button, Tooltip, ThemeIcon } from '@mantine/core';
import { useCountUp } from 'react-countup';
import Layout from '@/components/Layout/Layout';
import { fetcher } from '@/utils/fetcher'
import SearchItem from '@/components/SearchItem/SearchItem';
import { IconCurrencyEuro, IconArrowRight, IconQuestionMark } from '@tabler/icons-react';

// todo mobile

const ImmoGuesser = ({ data }) => {
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [inputVal, setInputVal] = useState('')

  const countUpRef = React.useRef(null);
  const { start, pauseResume, reset, update } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: 0,
    duration: 1.5,
  });

  const eurIcon = <IconCurrencyEuro style={{ width: rem(20), height: rem(20) }} stroke={1.5} />;

  const handleSubmit = (e) => {
    e.preventDefault()
    setRevealed(true)
    const result = data[level].price.value > inputVal
      ? data[level].price.value - inputVal
      : inputVal - data[level].price.value
    const newScore = result + score

    // todo confetti if correct result

    update(newScore)
    setScore(newScore)

    // todo handle last level
  }

  const goNext = () => {
    setRevealed(false)
    setLevel(level + 1)
    setInputVal('')
  }

  return (
    <Layout
      title="ImmoGuesser | Schätze die Miete der Wohnung"
      description="Teste dein Gespür für Mietpreise! In diesem kleinen Spiel bekommst du fünf verschiedene Wohnungen angezeigt. Deine Aufgabe: Schätze, wie viel die Wohnung kostet."
    >
      <Title order={1} mt="xl" mb="md">ImmoGuesser | Schätze die Miete der Wohnung</Title>
      <Text mb="xl">Teste dein Gespür für Mietpreise! In diesem kleinen Spiel bekommst du fünf verschiedene Wohnungen angezeigt. Deine Aufgabe: Schätze, wie viel die Wohnung kostet.</Text>

      <Flex gap="md" mb="xl">
        <Box w="100%">
          <Indicator position="top-start" radius="md" size={30} label={`${level + 1} / 5`}>
            <SearchItem item={data[level]} hidePrice={!revealed} hideLink={!revealed} />
          </Indicator>

          <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
            <Flex gap="xl">
              {/* todo submit on enter */}
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
                  />
                  <ActionIcon variant="filled" aria-label="Settings" h="36px" w="36px" type="submit" disabled={revealed}>
                    <IconArrowRight style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                </Flex>
              </form>
              <Divider orientation="vertical" />
              <Box>
                <Flex gap="sm">
                  <Text fw="500" size="sm">Dein Ergebniss</Text>
                  <Tooltip label="Errechnet sich aus der Differenz zwischen deinem Tipp und dem Preis (je niedriger desto besser)">
                    <ThemeIcon variant="outline" size="xs" color="cyan.9" radius="xl">
                      <IconQuestionMark style={{ width: '70%', height: '70%' }} />
                    </ThemeIcon>
                  </Tooltip>
                </Flex>

                <Text fw="700" size="xl" c="teal.9" ref={countUpRef}>0</Text>
              </Box>
              <Divider orientation="vertical" />
              <Button disabled={!revealed} mt="sm" onClick={goNext}>Weiter</Button>
            </Flex>
          </Card>
        </Box>

        <Box miw="250px">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={2} size="h4" mb="sm">Leaderboards</Title>

            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th></Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Ergebniss</Table.Th>
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
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { query } = context;
  const { q = '' } = query;
  const [data] = await Promise.all([
    fetcher(`${process.env.BASE_URL}/api/immo-guesser?q=${q}`),
  ]);

  return {
    props: {
      q,
      data,
    },
  };
}

export default ImmoGuesser;