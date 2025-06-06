import { Card, Table, Text } from '@mantine/core'
import React from 'react'

function ResultTable({ data, showType, measures, dataLength }) {
  return (<>
    <Table mb="xl" striped display={{ base: 'none', md: 'table' }} withTableBorder>
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
        {(dataLength > data.length) && <Table.Tr>
          <Table.Td fs="italic">...und {dataLength - data.length} weitere Förderungen</Table.Td>
          {showType && <Table.Td></Table.Td>}
          <Table.Td></Table.Td>
        </Table.Tr>}
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

    {(dataLength > data.length) && <Card withBorder p="md" mb="xl" bg="gray.0" display={{ base: 'block', md: 'none' }}>
      <Text fs="italic" size='sm'>...und {dataLength - data.length} weitere Förderungen</Text>
    </Card>}
  </>
  )
}

export default ResultTable
