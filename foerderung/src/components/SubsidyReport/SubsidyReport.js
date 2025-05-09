import React from 'react'
import Link from 'next/link'
import { Box, Title, Text, Table, List, Divider, Button, Card } from "@mantine/core";
import showdown from 'showdown';
import { mapToMantineComponents } from '@/utils/convertHtmlToMantine';

const converter = new showdown.Converter();

const SubsidyItem = ({ subsidy, isPdf = false, index, user, type }) => {
  const url = new URL(subsidy.Website);
  const baseUrl = url.origin;
  const isPaid = user.Variant !== 'free'
  return (
    <>
      {index > 0 && <Box my="md"></Box>}
      <Card withBorder>

        <Title order={3} size="h3" mb="md" id={`headline-${type}-${index}`}>{subsidy.Name}</Title>

        {user.Type.length > 1 && <Text><strong>Art der Förderung:</strong> {subsidy.Type.join(', ')}</Text>}
        {isPaid && subsidy.MaxFundingRate && <Text><strong>Maximale Förderrate:</strong> {subsidy.MaxFundingRate}</Text>}
        {isPaid && subsidy.BaseFundingRate && <Text><strong>Basisförderrate:</strong> {subsidy.BaseFundingRate}</Text>}
        {subsidy.ApplicationDeadline && <Text><strong>Antragsfristen:</strong> {subsidy.ApplicationDeadline}</Text>}
        <Text mb="md"><strong>Offizielle Webseite:</strong> <a href={subsidy.Website}>{baseUrl}</a></Text>

        {isPaid && subsidy.Requirements && <Box mb="md">
          <Title order={3} size="h3" mb="md">Voraussetzungen:</Title>
          {mapToMantineComponents(converter.makeHtml(subsidy.Requirements))}
        </Box>}

        {isPaid && subsidy.Measures && <>
          <Title order={3} size="h4" mb="md">Förderfähige Maßnahmen:</Title>
          <Text mb="md">{subsidy.Measures.filter(m => user.Measures.includes(m)).join(', ')}</Text>
        </>}

        {isPaid && subsidy.Accumulation && <>
          <Title order={3} size="h4" mb="md">Kumulierung mit anderen Programmen:</Title>
          <Text>{subsidy.Accumulation}</Text>
        </>}

        {isPaid && subsidy.Guidance && <Box mt="md">
          {mapToMantineComponents(converter.makeHtml(subsidy.Guidance))}
        </Box>}
      </Card >
    </>


  )
}

const SectionDivider = ({ isPdf }) => isPdf
  ? <div style={{ pageBreakBefore: 'always' }}></div>
  : <Box my="md"></Box>

function SubsidyReport({ data, isPdf = false, baseUrl }) {
  const { user, subsidies } = data
  const isPaid = user.Variant !== 'free'
  const checkoutLink = isPdf ? `${baseUrl}/checkout?id=${user.uuid}` : `/checkout?id=${user.uuid}`
  const questionnaireLink = isPdf ? `${baseUrl}/fragebogen?id=${user.uuid}` : `/fragebogen?id=${user.uuid}`
  const answeredQuestions = user.Answers && Object.keys(user.Answers).length
  const filteredSubsidies = !answeredQuestions ? subsidies : subsidies.filter(d => d?.Questions?.every(element => {
    const userAnswer = user.Answers[element.Id]
    return d.Type.includes('Kredit') || (userAnswer === 'Unklar' || (userAnswer === 'Ja' && element.RequiredAnswer) || (userAnswer === 'Nein' && !element.RequiredAnswer))
  }))

  const selfSubsidies = filteredSubsidies.filter(s => s.Type.includes('Zuschuss') && s.ConsultantNeeded === false)
  const consultantSubsidies = filteredSubsidies.filter(s => s.Type.includes('Zuschuss') && s.ConsultantNeeded === true)
  const creditSubsidies = filteredSubsidies.filter(s => s.Type.includes('Kredit'))

  return (
    <Box p={isPdf ? 'xs' : 0}>
      <Title order={2} size="h2" mb="sm">Deine Daten</Title>
      <Table mb="xl" striped>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td><b>E-Mail</b></Table.Td>
            <Table.Td>{user.Email}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td><b>Förderungen für</b></Table.Td>
            <Table.Td>{user.HouseType}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td><b>Art der Förderung</b></Table.Td>
            <Table.Td>{user.Type.join(', ')}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td><b>Immobilienstandort</b></Table.Td>
            <Table.Td>{user.Region}{user.District ? ` - ${user.District}` : ''}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td><b>Zu Fördernde Maßnahmen</b></Table.Td>
            <Table.Td>{user.Measures.join(', ')}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      {!isPaid && <Card mb="xl" withBorder p="lg">
        <Title order={3} mb="md" id="full-report">Vollständigen Report freischalten</Title>
        <Text mb="md">Hol dir jetzt den vollständigen Report und erhalte eine detaillierte Übersicht sowie eine Schritt-für-Schritt-Anleitung zur Beantragung der Fördermittel. Außerdem erhältst du kurze Fragebögen, die dir sofort zeigen, ob du für die Förderung berechtigt bist!</Text>
        <Button href={checkoutLink} component={isPdf ? 'a' : Link}>
          Vollständigen Report Kaufen
        </Button>
      </Card>}

      {isPaid && <Card mb="xl" withBorder p="lg">
        <Title order={3} mb="md" id="full-report">Jetzt den Fragebogen {answeredQuestions ? 'erneut ' : ''}starten</Title>
        <Text mb="md">Fülle jetzt den kurzen Fragenbogen aus um sofort zu sehen, für welche Förderungen du berechtigt bist!</Text>
        <Button href={questionnaireLink} component={isPdf ? 'a' : Link}>
          Fragebogen starten
        </Button>
      </Card>}

      <Title order={2} size="h2" mb="sm">Deine Förderungen ({filteredSubsidies.length})</Title>
      <List withPadding>
        {selfSubsidies.length > 0 && <List.Item ml="-1em" my="xs" icon={<></>}><Text fw="bold">Direkt beantragbare Förderungen</Text></List.Item>}
        {selfSubsidies.map((subsidy, index) => (
          <List.Item key={subsidy.Name}><a href={`#headline-self-${index}`}>{subsidy.Name}</a></List.Item>
        ))}
        {consultantSubsidies.length > 0 && <List.Item ml="-1em" my="xs" icon={<></>}><Text fw="bold">Förderungen mit Energieberater</Text></List.Item>}
        {consultantSubsidies.map((subsidy, index) => (
          <List.Item key={subsidy.Name}><a href={`#headline-consultant-${index}`}>{subsidy.Name}</a></List.Item>
        ))}
        {creditSubsidies.length > 0 && <List.Item ml="-1em" my="xs" icon={<></>}><Text fw="bold">Kredite mit Finanzierungspartner</Text></List.Item>}
        {creditSubsidies.map((subsidy, index) => (
          <List.Item key={subsidy.Name}><a href={`#headline-credit-${index}`}>{subsidy.Name}</a></List.Item>
        ))}
      </List>

      {selfSubsidies.length > 0 && <>
        <SectionDivider isPdf={isPdf} />
        <Title order={2} size="h2" mt="xl">Direkt beantragbare Förderungen</Title>
        <Text mb="xl" fs="italic">Diese Fördermittel kannst du selbst beantragen, ohne zusätzliche Unterstützung.</Text>
        {selfSubsidies.map((subsidy, index) => <SubsidyItem key={subsidy.Name} user={user} index={index} subsidy={subsidy} isPdf={isPdf} type="self" />)}
      </>}

      {consultantSubsidies.length > 0 && <>
        <SectionDivider isPdf={isPdf} />
        <Title order={2} size="h2" mt="xl">Förderungen mit Energieberater</Title>
        <Text mb="xl" fs="italic">Für diese Fördermittel ist die Einbindung eines zertifizierten Energieberaters erforderlich.</Text>
        {consultantSubsidies.map((subsidy, index) => <SubsidyItem key={subsidy.Name} user={user} index={index} subsidy={subsidy} isPdf={isPdf} type="consultant" />)}
      </>}

      {creditSubsidies.length > 0 && <>
        <SectionDivider isPdf={isPdf} />
        <Title order={2} size="h2" mt="xl">Kredite mit Finanzierungspartner</Title>
        <Text mb="xl" fs="italic">Diese Kredite beantragst du über einen Finanzierungsberater oder deine Hausbank.</Text>
        {creditSubsidies.map((subsidy, index) => <SubsidyItem key={subsidy.Name} user={user} index={index} subsidy={subsidy} isPdf={isPdf} type="credit" />)}
      </>}

      {user.Variant === 'premium' && <Card mb="xl" withBorder p="lg" mt="xl">
        <Title order={3} mb="md" id="full-report">Report upgraden</Title>
        <Text mb="md">Hol dir jetzt das Upgade auf Professional um auch Fragebögen für die Zuschüsse zu erhalten, für die ein zertifizierten Energieberater erforderlich ist.</Text>
        <Button href={checkoutLink} component={isPdf ? 'a' : Link}>
          Report upgraden
        </Button>
      </Card>}
    </Box>
  )
}

export default SubsidyReport
