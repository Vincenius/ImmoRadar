import { Box, Title, Text, Divider, Table, List } from "@mantine/core";
import showdown from 'showdown';

const converter = new showdown.Converter();

export async function getServerSideProps({ req, res, resolvedUrl }) {
  // Get the custom header
  const headerValue = req.headers['x-api-key'];

  // Check if the header exists and matches a value
  if (!headerValue || headerValue !== process.env.API_KEY) {
    // Redirect to a 403 error page or to another page if the header is invalid
    return {
      redirect: {
        destination: '/foerderung', // Or any other page
        permanent: false,
      },
    };
  }

  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');

  const data = await fetch(`${process.env.BASE_URL}/api/subsidies?id=${id}`, {
    method: 'GET',
    headers: {
      'x-api-key': process.env.API_KEY
    }
  }).then(res => res.json())

  return {
    props: { data },
  };
}

const PdfReport = ({ data }) => {
  const { user, subsidies } = data

  return <Box>
    <Title order={2} size="h2" mb="sm">Deine Daten</Title>
    <Table mb="xl">
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
          <div style={{ pageBreakBefore: 'always' }}></div>
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
  </Box>;
};

export default PdfReport;
