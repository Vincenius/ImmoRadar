import React from 'react'
import Link from 'next/link'
import { Box, Title, Text, Table, List, Divider, Button, Card } from "@mantine/core";
import showdown from 'showdown';

const converter = new showdown.Converter();
const loremIpsum = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."

function getRandomText(index) {
  const words = loremIpsum.split(" ");
  const numWords = (index * 3 + 5) % 11 + 5;
  const startIndex = (index * 17) % (words.length - numWords); // Simple deterministic index calculation
  const passage = words.slice(startIndex, startIndex + numWords).join(" ");
  return passage;
}
const SectionDivider = ({ isPdf }) => isPdf
  ? <div style={{ pageBreakBefore: 'always' }}></div>
  : <Divider my="lg" />

function SubsidyReport({ data, isPdf = false, baseUrl }) {
  const { user, subsidies, fullReportLength } = data
  const mockArray = Array.from({ length: fullReportLength - 3 }, (_, index) => index)
  const checkoutLink = isPdf ? `${baseUrl}/checkout?id=${user.uuid}` : `/checkout?id=${user.uuid}`

  return (
    <Box>
      <Title order={2} size="h2" mb="sm">Deine Daten</Title>
      <Table mb="xl" striped>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>E-Mail</Table.Td>
            <Table.Td>{user.Email}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Förderungen für</Table.Td>
            <Table.Td>{user.HouseType}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Art der Förderung</Table.Td>
            <Table.Td>{user.Type.join(', ')}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Immobilienstandort</Table.Td>
            <Table.Td>{user.Region}{user.District ? ` - ${user.District}` : ''}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Zu Fördernde Maßnahmen</Table.Td>
            <Table.Td>{user.Measures.join(', ')}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Title order={2} size="h2" mb="sm">Deine Förderungen ({subsidies.length}{!user.isPaid ? ` von ${fullReportLength}` : ''})</Title>
      <List withPadding>
        {subsidies.map((subsidy, index) => (
          <List.Item key={subsidy.Name}><a href={`#headline-${index}`}>{subsidy.Name}</a></List.Item>
        ))}
        {!user.isPaid && <Box pos="relative">
          {mockArray.map(i => <List.Item key={`mock-${i}`}>
            <Text style={{ filter: 'blur(5px)' }}><a href="#full-report">{getRandomText(i)}</a></Text>
          </List.Item>)}
          <Button pos="absolute" top="50%" left="50%" style={{ transform: "translate(-50%, -50%)" }} href={checkoutLink} component={isPdf ? 'a' : Link}>
            Vollständigen Report Kaufen
          </Button>
        </Box>}

      </List>

      {subsidies.map((subsidy, index) => {
        const url = new URL(subsidy.Website);
        const baseUrl = url.origin;
        return (
          <Box key={subsidy.Name + '-details'}>
            <SectionDivider isPdf={isPdf} />
            <Title order={2} size="h2" mb="md" id={`headline-${index}`}>{subsidy.Name}</Title>

            {user.Type.length > 1 && <Text><strong>Art der Förderung:</strong> {subsidy.Type.join(', ')}</Text>}
            {subsidy.MaxFundingRate && <Text><strong>Maximale Förderrate:</strong> {subsidy.MaxFundingRate}</Text>}
            {subsidy.BaseFundingRate && <Text><strong>Basisförderrate:</strong> {subsidy.BaseFundingRate}</Text>}
            {subsidy.ApplicationDeadline && <Text><strong>Antragsfristen:</strong> {subsidy.ApplicationDeadline}</Text>}
            <Text mb="md"><strong>Offizielle Webseite:</strong> <a href={subsidy.Website}>{baseUrl}</a></Text>

            {subsidy.Requirements && <Box mb="md">
              <Title order={3} size="h3" mb="md">Voraussetzungen:</Title>
              <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(subsidy.Requirements) }}></div>
            </Box>
            }

            {subsidy.Measures && <>
              <Title order={3} size="h4" mb="md">Förderfähige Maßnahmen:</Title>
              <Text mb="md">{subsidy.Measures.filter(m => user.Measures.includes(m)).join(', ')}</Text>
            </>}

            {subsidy.Accumulation && <>
              <Title order={3} size="h4" mb="md">Kumulierung mit anderen Programmen:</Title>
              <Text mb="md">{subsidy.Accumulation}</Text>
            </>}
          </Box>
        )
      })}

      {!user.isPaid && <Box mb="xl">
        <SectionDivider isPdf={isPdf} />

        <Box pos="relative">
          <Title order={2} size="h2" mb="md" style={{ filter: 'blur(8px)' }}>{getRandomText(1)}</Title>
          <Text style={{ filter: 'blur(8px)' }}><strong>Maximale Förderrate:</strong> 1000€</Text>
          <Text style={{ filter: 'blur(8px)' }}><strong>Basisförderrate:</strong> 100€ / 10m</Text>
          <Text mb="md" style={{ filter: 'blur(8px)' }}><strong>Antragsfristen:</strong> LoremIpsum</Text>

          <Box mb="md">
            <Title order={3} size="h4" mb="md" style={{ filter: 'blur(8px)' }}>Voraussetzungen:</Title>
            <Text mb="md" style={{ filter: 'blur(8px)' }}>
            {getRandomText(1)} {getRandomText(2)} {getRandomText(3)} {getRandomText(1)} {getRandomText(2)} {getRandomText(3)} <br/><br/>
            {getRandomText(5)} {getRandomText(6)} {getRandomText(7)} {getRandomText(8)}
            </Text>
          </Box>

          <Card shadow="md" pos="absolute" top="50%" left="50%" style={{ transform: "translate(-50%, -50%)" }} p="lg">
            <Title order={3} mb="md" id="full-report">Alle Förderungen freischalten</Title>
            <Text mb="md">Kaufe jetzt den vollständigen Report und schalte alle <b>{fullReportLength} Förderungen</b> frei.</Text>
            <Button href={checkoutLink} component={isPdf ? 'a' : Link}>
              Vollständigen Report Kaufen
            </Button>
          </Card>
        </Box>
      </Box>}
    </Box>
  )
}

export default SubsidyReport
