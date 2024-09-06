import Layout from "@/components/Layout/Layout";
import useSWR from "swr";
import { useState } from "react";
import { Container, Button, Group, Table, Pagination, Title, Text, Skeleton } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { fetcher } from "@/utils/fetcher";

export default function Home() {
  const [from, setFrom] = useState(new Date(new Date().toISOString().split('T')[0]));
  const [to, setTo] = useState(new Date());
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');

  const { data, error, isLoading } = useSWR(`/api/logs?from=${from.toISOString()}&to=${to.toISOString()}&page=${page}&type=${typeFilter}`, fetcher);

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
    setPage(1); // Reset to page 1 on date range change
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
          <Text c="red">Failed to load logs.</Text>
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

        <Group position="apart" mb="md">
          <Button variant={typeFilter === '' ? 'light' : 'outline'} onClick={() => setTypeFilter('')}>All</Button>
          <Button variant={typeFilter === 'NEW_SCAN' ? 'light' : 'outline'}  onClick={() => setTypeFilter('NEW_SCAN')}>New Scan</Button>
          <Button variant={typeFilter === 'FULL_SCAN' ? 'light' : 'outline'}  onClick={() => setTypeFilter('FULL_SCAN')}>Full Scan</Button>
        </Group>

        <Title order={3} mb="md">Summary</Title>
        {data.summary.sort((a, b) => b.scraper - a.scraper).map((item) => (
          <Group key={item._id} mb="sm">
            <Text><strong>Scraper:</strong> {item._id}</Text>
            <Text><strong>Success True:</strong> {item.success_true}</Text>
            <Text><strong>Success False:</strong> {item.success_false}</Text>
          </Group>
        ))}

        <Title order={3} mt="lg">Logs</Title>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Scraper</Table.Th>
              <Table.Th>Details</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.logs.map((log) => (
              <Table.Tr key={log._id} bg={log.success ? 'green.1' : 'red.1'}>
                <Table.Td>{new Date(log.created_at).toLocaleString()}</Table.Td>
                <Table.Td>{log.scraper}</Table.Td>
                <Table.Td>{log.message}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Pagination
          value={page}
          onChange={setPage}
          total={data.pagination.totalPages}
          mt="lg"
        />
      </Container>
    </Layout>
  );
}
