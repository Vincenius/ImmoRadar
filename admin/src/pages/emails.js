
import React from "react";
import Layout from "@/components/Layout/Layout";
import useSWR from "swr";
import { useState } from "react";
import { Container, Button, Group, Table, Title, Text, Skeleton, Card, Flex } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { fetcher } from "@/utils/fetcher";

export default function Home() {
  const [from, setFrom] = useState(new Date(new Date().toISOString().split('T')[0]));
  const [to, setTo] = useState(new Date());

  const { data, error, isLoading } = useSWR(`/api/email?from=${from.toISOString()}&to=${to.toISOString()}`, fetcher);

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

  // group emails by email
  const groupedEmails = data.emails.reduce((acc, email) => {
    if (!acc[email.email]) {
      acc[email.email] = [];
    } 
    acc[email.email].push(email);
    return acc;
  }, {});

  console.log(groupedEmails)

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

        <Title order={3} mb="md">Email Stats</Title>

        <Flex gap="md" mb="xl">
          <Card padding="xl" withBorder shadow="md">
            <Title size="1rem" mb="sm">Emails Send | Opened:</Title>
            <Title size="2rem">
              {data.emails.length} | {data.emails.filter(e => e.opened).length}
            </Title>
            <Text>({(100 * data.emails.filter(e => e.opened).length / data.emails.length).toFixed(2)}%)</Text>
          </Card>
          <Card padding="xl" withBorder shadow="md">
            <Title size="1rem" mb="sm">Subscribers:</Title>
            <Title size="2rem">{data.subscribers.length}</Title>
          </Card>
        </Flex>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Email</Table.Th>
              <Table.Th>Received</Table.Th>
              <Table.Th>Opened</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {Object.entries(groupedEmails).map(([email, emails]) => (
              <Table.Tr key={email}>
                <Table.Td>{email}</Table.Td>
                <Table.Td>{emails.length}</Table.Td>
                <Table.Td>{emails.filter(e => e.opened).length}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Container>
    </Layout>
  );
}
