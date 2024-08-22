import React from "react";
import Layout from "@/components/Layout/Layout";
import useSWR from "swr";
import { useState } from "react";
import { Container, Button, Group, Table, Title, Text, Skeleton } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { fetcher } from "@/utils/fetcher";

export default function Home() {
  const [from, setFrom] = useState(new Date(new Date().toISOString().split('T')[0]));
  const [to, setTo] = useState(new Date());

  const { data, error, isLoading } = useSWR(`/api/fields?from=${from.toISOString()}&to=${to.toISOString()}`, fetcher);

  const handleDateRangeChange = (range) => {
    const now = new Date();
    switch (range) {
      case "Today":
        setFrom(new Date(now.setHours(0, 0, 0, 0)));
        setTo(new Date());
        break;
      case "Week":
        setFrom(new Date(now.setDate(now.getDate() - 7)));
        setTo(new Date());
        break;
      case "Month":
        setFrom(new Date(now.setDate(now.getDate() - 30)));
        setTo(new Date());
        break;
      case "All Time":
        setFrom(new Date("1970-01-01"));
        setTo(new Date());
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Container>
          <Skeleton height={50} mb="xl" />
          <Skeleton height={200} />
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container>
          <Text color="red">Failed to load data.</Text>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Group position="apart" mb="md">
          <DatePickerInput placeholder="From" value={from} onChange={setFrom} />
          <DatePickerInput placeholder="To" value={to} onChange={setTo} />
          <Button variant="outline" onClick={() => handleDateRangeChange("Today")}>Today</Button>
          <Button variant="outline" onClick={() => handleDateRangeChange("Week")}>Week</Button>
          <Button variant="outline" onClick={() => handleDateRangeChange("Month")}>Month</Button>
          <Button variant="outline" onClick={() => handleDateRangeChange("All Time")}>All Time</Button>
        </Group>

        <Title order={3} mb="md">Field Completion Summary</Title>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Field</Table.Th>
              {data && data.map((providerData) => (
                <Table.Th key={providerData.provider}>{providerData.provider}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data && 
              Object.keys(data[0].fields).map((field) => (
                <Table.Tr key={field}>
                  <Table.Td>{field}</Table.Td>
                  {data.map((providerData) => (
                    <Table.Td key={`${providerData.provider}-${field}`} bg={providerData.fields[field] < 50 ? 'red.1' : 'inherit'}>
                      {providerData.fields[field] !== undefined
                        ? `${providerData.fields[field].toFixed(2)}%`
                        : 'N/A'}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            }
          </Table.Tbody>
        </Table>
      </Container>
    </Layout>
  );
}
