import { NumberFormatter, Table, Title } from '@mantine/core'
import React from 'react'

function ResultTable({ data, amount, showType, measures }) {
  return (<>
    <Title order={2} size="h3" mb="xl" ta="center" textWrap="balance">
      Wir konnten {data.length} {data.length > 1 ? 'Förderungen' : 'Förderung'} {amount && <>mit einer maximalen Fördersumme von <NumberFormatter suffix="€" value={amount} thousandSeparator="." decimalSeparator="," decimalScale={0} /> </>}für die eingestellten Kriterien finden.
    </Title>

    <Table mb="xl" striped display={{ base: 'none', md: 'table' }}>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>Förderung</Table.Th>
          {showType && <Table.Th>Art der Förderung</Table.Th>}
          <Table.Th>Maßnahmen</Table.Th>
        </Table.Tr>
        {data.map((d, index) => (
          <Table.Tr key={d.Id}>
            <Table.Td>{d.Name}</Table.Td>
            {showType && <Table.Td>{d.Type.join(', ')}</Table.Td>}
            <Table.Td>{d.Measures.filter(m => measures.includes(m)).join(', ')}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>

    {data.map((d, index) => (<Table
      mb="xl"
      display={{ base: 'table', md: 'none' }}
      withTableBorder key={`mobile-table-${index}`}
      bg={index % 2 === 1 ? 'gray.0' : 'white'}
    >
      <Table.Tbody>
        <Table.Tr key={d.Id}>
          <Table.Td w="100px"><b>Förderung</b></Table.Td>
          <Table.Td>{d.Name}</Table.Td>
        </Table.Tr>
        {showType && <Table.Tr>
          <Table.Td w="100px"><b>Art der Förderung</b></Table.Td>
          <Table.Td>{d.Type.join(', ')}</Table.Td>
        </Table.Tr>}
        <Table.Tr>
          <Table.Td w="100px"><b>Maßnahmen</b></Table.Td>
          <Table.Td>{d.Measures.filter(m => measures.includes(m)).join(', ')}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>))}
  </>
  )
}

export default ResultTable
