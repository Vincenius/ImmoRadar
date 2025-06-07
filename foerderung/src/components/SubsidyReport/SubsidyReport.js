import React from 'react'
import Link from 'next/link'
import { Box, Title, Text, List, Button, Card, Image, Flex, Divider } from "@mantine/core";
import showdown from 'showdown';
import { mapToMantineComponents } from '@/utils/convertHtmlToMantine';
import classes from './SubsidyReport.module.css'

const converter = new showdown.Converter();

const SectionHeader = ({ title, text, image }) => {
  return <Flex pos="relative" h="300px" mb="xl" align="center" className={classes.sectionHeader}>
    <Image src={image} w="100%" h={300} pos="absolute" zIndex={-1} className={classes.sectionHeaderImage} />
    <Box mx="4em" pos="relative" style={{ zIndex: 1 }}>
      <Title order={2} size="h1">{title}</Title>
      <Text fs="italic" size="lg">{text}</Text>
    </Box>
  </Flex>
}

const SubsidyItem = ({ subsidy, index, user, type }) => {
  const url = new URL(subsidy.Website);
  const baseUrl = url.origin;
  const isPaid = user.Variant !== 'free'
  const isPremium = user.Variant === 'premium' || user.Variant === 'premium_plus'

  return (
    <>
      {index > 0 && !isPaid && <Box my="xl"></Box>}
      {index > 0 && isPaid && <div style={{ pageBreakBefore: 'always' }}></div>}
      <Card withBorder>
        <Card.Section p="md" className={classes.pattern} withBorder mb="md">
          <Title order={3} size="h3" id={`headline-${type}-${index}`}>{subsidy.Name}</Title>
        </Card.Section>

        {user.Type.length > 1 && <Text size="xs"><strong>Art der Förderung:</strong> {subsidy.Type.join(', ')}</Text>}
        <Text mb="md" size="xs"><strong>Offizielle Webseite:</strong> <a href={subsidy.Website}>{baseUrl}</a></Text>
        {isPaid && subsidy.MaxFundingRate && <Text size="xs"><strong>Maximale Förderrate:</strong> {subsidy.MaxFundingRate}</Text>}
        {isPaid && subsidy.BaseFundingRate && <Text size="xs"><strong>Basisförderrate:</strong> {subsidy.BaseFundingRate}</Text>}
        {subsidy.ApplicationDeadline && <Text size="xs"><strong>Antragsfristen:</strong> {subsidy.ApplicationDeadline}</Text>}

        {isPaid && subsidy.Requirements && <Card.Section mt="md" withBorder p="md">
          <Title order={3} size="h4" mb="md">Voraussetzungen:</Title>
          {mapToMantineComponents(converter.makeHtml(subsidy.Requirements))}
        </Card.Section>}

        {isPaid && subsidy.Measures && <Card.Section withBorder p="md">
          <Title order={3} size="h4" mb="md">Förderfähige Maßnahmen:</Title>
          <Text size="xs">{subsidy.Measures.filter(m => user.Measures.includes(m)).join(', ')}</Text>
        </Card.Section>}

        {isPaid && subsidy.Accumulation && <Card.Section withBorder p="md">
          <Title order={3} size="h4" mb="md">Kumulierung mit anderen Programmen:</Title>
          <Text size="xs">{subsidy.Accumulation}</Text>
        </Card.Section>}

        {isPremium && subsidy.Guidance && <Card.Section withBorder p="md">
          <Title order={3} size="h4" mb="md">Anleitung zur Antragstellung:</Title>
          {mapToMantineComponents(converter.makeHtml(subsidy.Guidance))}
        </Card.Section>}

        <Card.Section withBorder p="md" mt="md">
          <Title order={3} size="h4" mb="md">Notizen:</Title>
          <Divider my="xl" />
          <Divider my="xl" />
          <Divider mt="xl" mb="md" />
        </Card.Section>
      </Card>
    </>
  )
}

function SubsidyReport({ data, baseUrl }) {
  const { user, subsidies } = data

  const isPremium = user.Variant === 'premium' || user.Variant === 'premium_plus'
  const answeredQuestions = user.Answers && Object.keys(user.Answers).length
  const filteredSubsidies = !answeredQuestions ? subsidies : subsidies.filter(d => d?.Questions?.every(element => {
    const userAnswer = user.Answers[element.Id]
    return d.Type.includes('Kredit') || (userAnswer === 'Unklar' || (userAnswer === 'Ja' && element.RequiredAnswer) || (userAnswer === 'Nein' && !element.RequiredAnswer))
  }))

  const selfSubsidies = filteredSubsidies.filter(s => s.Type.includes('Zuschuss') && s.ConsultantNeeded === false)
  const consultantSubsidies = filteredSubsidies.filter(s => s.Type.includes('Zuschuss') && s.ConsultantNeeded === true)
  const creditSubsidies = filteredSubsidies.filter(s => s.Type.includes('Kredit'))

  return (
    <>
      <SectionHeader
        title={`Deine ${filteredSubsidies.length} Förderungen`}
        image={`${baseUrl}/imgs/pdf/overview-header.jpg`}
      />
      <Box className={classes.container} px="4em">
        <Card withBorder p="md">
          {/* <Card.Section p="md" className={classes.pattern} withBorder mb="md">
            <Title order={3} size="h3" ta="center">Deine {filteredSubsidies.length} Förderungen</Title>
          </Card.Section> */}
          <List withPadding size="xs">
            {selfSubsidies.length > 0 && <List.Item ml="-1em" my="xs" icon={<></>}><Text fw="bold" size="sm">Direkt beantragbare Förderungen</Text></List.Item>}
            {selfSubsidies.map((subsidy, index) => (
              <List.Item key={subsidy.Name}>{subsidy.Name}</List.Item>
            ))}
            {consultantSubsidies.length > 0 && <List.Item ml="-1em" my="xs" icon={<></>}><Text fw="bold" size="sm">Förderungen mit Energieberater</Text></List.Item>}
            {consultantSubsidies.map((subsidy, index) => (
              <List.Item key={subsidy.Name}>{subsidy.Name}</List.Item>
            ))}
            {creditSubsidies.length > 0 && <List.Item ml="-1em" my="xs" icon={<></>}><Text fw="bold" size="sm">Kredite mit Finanzierungspartner</Text></List.Item>}
            {creditSubsidies.map((subsidy, index) => (
              <List.Item key={subsidy.Name}>{subsidy.Name}</List.Item>
            ))}
          </List>
        </Card>
      </Box>

      {selfSubsidies.length > 0 && <>
        <div style={{ pageBreakBefore: 'always' }}></div>
        <SectionHeader
          title="Direkt beantragbare Förderungen"
          text="Diese Fördermittel kannst du selbst beantragen, ohne zusätzliche Unterstützung."
          image={`${baseUrl}/imgs/pdf/self-header.jpg`}
        />
        <Box px="4em">
          {selfSubsidies.map((subsidy, index) => <SubsidyItem key={subsidy.Name} user={user} index={index} subsidy={subsidy} type="self" />)}
        </Box>
      </>}

      {consultantSubsidies.length > 0 && <>
        <div style={{ pageBreakBefore: 'always' }}></div>
        <SectionHeader
          title="Förderungen mit Energieberater"
          text="Für diese Fördermittel ist die Einbindung eines zertifizierten Energieberaters erforderlich."
          image={`${baseUrl}/imgs/pdf/expert-header.jpg`}
        />
        {isPremium && <Box ta="center">
          <Button mb="xs" fw="bold" component="a" size="md" href="https://www.energie-effizienz-experten.de/fuer-private-bauherren/finden-sie-experten-in-ihrer-naehe/suchergebnis">
            Finde jetzt einen qualifizierten Finanzierungsberater
          </Button>
          <Text mx="6em" size="xs" fs="italic" mb="xl">Hinweis: Für Inhalt und Aktualität des verlinkten PDFs ist die jeweils angegebene Seite bzw. der Anbieter verantwortlich.</Text>
        </Box>}
        <Box px="4em">
          {consultantSubsidies.map((subsidy, index) => <SubsidyItem key={subsidy.Name} user={user} index={index} subsidy={subsidy} type="consultant" />)}
        </Box>
      </>}

      {creditSubsidies.length > 0 && <>
        <div style={{ pageBreakBefore: 'always' }}></div>
        <SectionHeader
          title="Kredite mit Finanzierungspartner"
          text="Diese Kredite beantragst du über einen Finanzierungsberater oder deine Hausbank."
          image={`${baseUrl}/imgs/pdf/bank-header.jpg`}
        />
        {isPremium && <Box ta="center">
          <Button fw="bold" mb="xl" component="a" size="md" href="#todo">
            Finde jetzt einen qualifizierten Finanzierungsberater
          </Button>
        </Box>}
        <Box px="4em">
          {creditSubsidies.map((subsidy, index) => <SubsidyItem key={subsidy.Name} user={user} index={index} subsidy={subsidy} type="credit" />)}
        </Box>
      </>}

      {user.Variant === 'starter' && <Card mb="xl" withBorder p="lg" mt="xl" mx="4em">
        <Title order={3} mb="md" id="full-report">Report upgraden</Title>
        <Text mb="md">Hol dir jetzt das Upgade auf Premium, um eine Schritt-für-Schritt-Anleitungen zur schnellen Beantragung deiner Förderungen und vieles mehr zu erhalten.</Text>
        <Button href={`${baseUrl}/checkout?id=${user.uuid}`} component={'a'}>
          Report upgraden
        </Button>
      </Card>}
    </>
  )
}

export default SubsidyReport
