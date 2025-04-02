import React from 'react'
import Link from 'next/link'
import { Box, Title, Text, Table, List, Divider, Button, Card } from "@mantine/core";
import showdown from 'showdown';
import { mapToMantineComponents } from '@/utils/convertHtmlToMantine';

const converter = new showdown.Converter();

const SectionDivider = ({ isPdf }) => isPdf
  ? <div style={{ pageBreakBefore: 'always' }}></div>
  : <Divider my="lg" />

function SubsidyReport({ data, isPdf = false, baseUrl }) {
  const { user, subsidies } = data
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

      {!user.isPaid && <Box mb="xl">
        <SectionDivider isPdf={isPdf} />

        <Card shadow="md" p="lg">
            <Title order={3} mb="md" id="full-report">Vollständigen Report freischalten</Title>
            <Text mb="md">Hol dir jetzt den vollständigen Report und erhalte eine detaillierte Übersicht sowie eine Schritt-für-Schritt-Anleitung zur Beantragung der Fördermittel!</Text>
            <Button href={checkoutLink} component={isPdf ? 'a' : Link}>
              Vollständigen Report Kaufen
            </Button>
          </Card>
      </Box>}

      <Title order={2} size="h2" mb="sm">Deine Förderungen ({subsidies.length})</Title>
      <List withPadding>
        {subsidies.map((subsidy, index) => (
          <List.Item key={subsidy.Name}><a href={`#headline-${index}`}>{subsidy.Name}</a></List.Item>
        ))}
      </List>

      {subsidies.map((subsidy, index) => {
        const url = new URL(subsidy.Website);
        const baseUrl = url.origin;
        return (
          <Box key={subsidy.Name + '-details'}>
            <SectionDivider isPdf={isPdf} />
            <Title order={2} size="h2" mb="md" id={`headline-${index}`}>{subsidy.Name}</Title>

            {user.Type.length > 1 && <Text><strong>Art der Förderung:</strong> {subsidy.Type.join(', ')}</Text>}
            {user.isPaid && subsidy.MaxFundingRate && <Text><strong>Maximale Förderrate:</strong> {subsidy.MaxFundingRate}</Text>}
            {user.isPaid && subsidy.BaseFundingRate && <Text><strong>Basisförderrate:</strong> {subsidy.BaseFundingRate}</Text>}
            {subsidy.ApplicationDeadline && <Text><strong>Antragsfristen:</strong> {subsidy.ApplicationDeadline}</Text>}
            <Text mb="md"><strong>Offizielle Webseite:</strong> <a href={subsidy.Website}>{baseUrl}</a></Text>

            {user.isPaid && subsidy.Requirements && <Box mb="md">
              <Title order={3} size="h3" mb="md">Voraussetzungen:</Title>
              { mapToMantineComponents(converter.makeHtml(subsidy.Guidance)) }
              {/* <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(subsidy.Requirements) }}></div> */}
            </Box>}

            {user.isPaid && subsidy.Measures && <>
              <Title order={3} size="h4" mb="md">Förderfähige Maßnahmen:</Title>
              <Text mb="md">{subsidy.Measures.filter(m => user.Measures.includes(m)).join(', ')}</Text>
            </>}

            {user.isPaid && subsidy.Accumulation && <>
              <Title order={3} size="h4" mb="md">Kumulierung mit anderen Programmen:</Title>
              <Text mb="md">{subsidy.Accumulation}</Text>
            </>}

            {user.isPaid && subsidy.Guidance && <>
              <SectionDivider isPdf={isPdf} />
              { mapToMantineComponents(converter.makeHtml(subsidy.Guidance)) }
              {/* <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(subsidy.Guidance) }}></div> */}
            </>}
          </Box>
        )
      })}
    </Box>
  )
}

export default SubsidyReport
