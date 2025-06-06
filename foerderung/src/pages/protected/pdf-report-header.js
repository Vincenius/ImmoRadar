import { Box, Button, Card, Flex, Image, Table, Text, ThemeIcon, Title } from '@mantine/core';
import NextImage from 'next/image'
import { useEffect } from 'react';
import classes from '@/components/SubsidyReport/SubsidyReport.module.css'
import {
  IconMail,
  IconHome2,
  IconPigMoney,
  IconMapPin,
  IconTools
} from '@tabler/icons-react';

export async function getServerSideProps({ req, res, resolvedUrl }) {
  const headerValue = req.headers['x-api-key'];

  if (!headerValue || headerValue !== process.env.API_KEY) {
    return {
      redirect: {
        destination: '/foerdercheck',
        permanent: false,
      },
    };
  }

  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');
  const baseUrl = process.env.BASE_URL

  const data = await fetch(`${baseUrl}/api/subsidies?id=${id}`, {
    method: 'GET',
    headers: {
      'x-api-key': process.env.API_KEY
    }
  }).then(res => res.json())

  return {
    props: { data, baseUrl },
  };
}

const variantTextMap = {
  'free': 'Kostenfreie',
  'starter': 'Starter',
  'premium': 'Premium',
  'premium_plus': 'Premium',
}

const PdfReport = ({ data, baseUrl }) => {
  useEffect(() => {
    document.body.style.backgroundColor = 'white';

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const { user } = data
  const isPaid = user.Variant !== 'free'
  const questionnaireLink = `${baseUrl}/quickcheck?id=${user.uuid}`
  const checkoutLink = `${baseUrl}/checkout?id=${user.uuid}`

  return <Box>
    <Box bg="cyan.9" py="xl">
      <Image component={NextImage} src="/imgs/logo.png" width={150} height={150} w={150} h={150} alt="Logo" mx="auto" mb="md" />
      <Title order={1} size="4em" fw="lighter" c="#fff" align="center">Dein Förderreport</Title>
      <Text ta="center" c="#fff" mb="sm">- {variantTextMap[user.Variant]} Variante -</Text>
      <Text ta="center" c="#fff">vom {new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
    </Box>

    <Box px="4em" mt="xl">
      <Box mb="2em">
        <Title order={2} size="h5" mb="sm">Hallo {user.Name}, hier ist dein Förderreport</Title>
        {user.Variant === 'free' && (
          <>
            <Text size="xs" mb="xs">In dieser kostenlosen Übersicht erhältst du einen kompakten Einblick in die wichtigsten staatlichen Förderprogramme für dein Bau- oder Sanierungsvorhaben.</Text>
            <Text size="xs" mb="xs">Du findest hier alle Zuschüsse, die du selbst beantragen kannst – sowie solche, für die du einen Energieberater brauchst. Auch Förderkredite, die über Finanzierungspartner verfügbar sind, sind enthalten.</Text>
            <Text mb="md" size="xs">Wenn du noch mehr rausholen willst, sichere dir jetzt den vollständigen Förderreport mit einer individuellen Förderanalyse, Schritt-für-Schritt-Anleitungen zur Beantragung und einem Quickcheck, der dir sofort zeigt, ob du förderberechtigt bist.</Text>
            <Button size="xs" href={checkoutLink} component="a" mb="xs">Jetzt vollständigen Report freischalten</Button>
          </>
        )}

        {user.Variant === 'starter' && (
          <>
            <Text size="xs" mb="xs">Diese Version deines Förderreports enthält alle Informationen der kostenfreien Variante – und geht noch einen Schritt weiter:</Text>
            <Text size="xs" mb="xs">Mit dem enthaltenen <strong>Quickcheck</strong> erfährst du auf einen Blick, <strong>für welche Förderungen du persönlich berechtigt bist</strong>. Außerdem zeigen wir dir, wie hoch deine voraussichtliche Fördersumme ist.</Text>
          </>
        )}

        {(user.Variant === 'premium' || user.Variant === 'premium_plus') && (
          <>
            <Text size="xs" mb="xs">Du hältst die umfangreichste Version deines Förderreports in der Hand. Neben allen Inhalten aus der Starter-Variante enthält dieser Report detaillierte <strong>Schritt-für-Schritt-Anleitungen</strong> zur Beantragung deiner Förderungen.</Text>
            <Text size="xs" mb="xs">Zusätzlich bekommst du direkten Zugang zu <strong>zertifizierten Energieberater*innen</strong> und <strong>qualifizierten Finanzierungspartnern</strong> in deiner Region – damit du deine Förderung schnell, sicher und stressfrei beantragen kannst.</Text>
          </>
        )}

        {isPaid && <>
          <Text mb="md" size="xs">Falls du es noch nicht getan hast, kannst du jetzt den Quickcheck starten und in wenigen Minuten herausfinden, für welche Förderprogramme du konkret berechtigt bist.</Text>
          <Button size="xs" href={questionnaireLink} component="a" mb="xs">
            Quickcheck starten
          </Button>
        </>}
      </Box>

      <Title order={2} size="h5" mb="sm">Deine Daten</Title>
      <Card mb="xl" withBorder p="0">
        <Table striped>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <Flex gap="xs" align="center">
                  <ThemeIcon size="sm" variant='outline'>
                    <IconMail style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                  <Text fw="bold" size="xs">E-Mail</Text>
                </Flex>
              </Table.Td>
              <Table.Td><Text size="xs">{user.Email}</Text></Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td>
                <Flex gap="xs" align="center">
                  <ThemeIcon size="sm" variant='outline'>
                    <IconHome2 style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                  <Text fw="bold" size="xs">Förderungen für</Text>
                </Flex>
              </Table.Td>
              <Table.Td><Text size="xs">{user.HouseType}</Text></Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td>
                <Flex gap="xs" align="center">
                  <ThemeIcon size="sm" variant='outline'>
                    <IconPigMoney style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                  <Text fw="bold" size="xs">Art der Förderung</Text>
                </Flex>
              </Table.Td>
              <Table.Td><Text size="xs">{user.Type.join(', ')}</Text></Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td>
                <Flex gap="xs" align="center">
                  <ThemeIcon size="sm" variant='outline'>
                    <IconMapPin style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                  <Text fw="bold" size="xs">Immobilienstandort</Text>
                </Flex>
              </Table.Td>
              <Table.Td>
                <Text size="xs">
                  {user.Region}{user.District ? ` - ${user.District}` : ''}
                </Text>
              </Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td>
                <Flex gap="xs" align="center">
                  <ThemeIcon size="sm" variant='outline'>
                    <IconTools style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                  <Text fw="bold" size="xs">Zu Fördernde Maßnahmen</Text>
                </Flex>
              </Table.Td>
              <Table.Td><Text size="xs">{user.Measures.join(', ')}</Text></Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>
    </Box>
  </Box >
};

export default PdfReport;
