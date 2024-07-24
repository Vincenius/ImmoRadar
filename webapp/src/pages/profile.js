import { useEffect } from 'react';
import useSWR from 'swr'
import { useRouter } from 'next/router';
import { Title, Table, Skeleton, Switch, ActionIcon, Flex } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import Layout from '@/components/Layout/Layout';
import { fetcher } from '@/utils/fetcher';

const Profile = () => {
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const { confirm } = router.query;
        if (confirm === 'true') {
            const { pathname, query } = router;
            notifications.show({
                title: 'E-Mail bestätigt',
                message: 'Vielen Dank! Deine E-Mail-Adresse wurde bestätigt.',
                color: 'green',
            });
            // Remove the confirm query param from the URL
            const params = new URLSearchParams(query);
            params.delete('confirm');
            router.replace(
                { pathname, query: params.toString() },
                undefined,
                { shallow: true }
            );
        }
    }, [router.query]);

    const { data = {}, error, isLoading } = useSWR(`/api/profile?token=${id}`, fetcher)

    return (
        <Layout title="ImmoRadar | Deine Benachrichtigungen" description="Verwalte deine Benachrichtigungen">
            <Title pt="xl" mb="xl">Deine Benachrichtigungen</Title>

            {/* switch (de-)activate all */}
            <Table striped>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Suchbegriff</Table.Th>
                        <Table.Th>Filter</Table.Th>
                        <Table.Th>Häufigkeit</Table.Th>
                        <Table.Th>Aktiv</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {isLoading && Array.from({ length: 5 }).map((_, index) => (
                        <Table.Tr key={`table-loading-${index}`}>
                            <Table.Td><Skeleton height={12} radius="xl" width="80%" my="sm" /></Table.Td>
                            <Table.Td><Skeleton height={12} radius="xl" width="70%" my="sm" /></Table.Td>
                            <Table.Td><Skeleton height={12} radius="xl" width="30%" my="sm" /></Table.Td>
                            <Table.Td><Skeleton height={12} radius="xl" width="40px" my="sm" /></Table.Td>
                        </Table.Tr>
                    ))}
                    {!isLoading && (data.notifications || []).map((notification, index) => (
                        <Table.Tr key={`table-notification-${index}`}>
                            <Table.Td>
                                <Flex align="center" gap="sm">
                                    {notification.query}
                                    <ActionIcon title="Suchbegriff bearbeiten" onClick={() => console.log('edit')} variant="subtle">
                                        <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                    </ActionIcon>
                                </Flex>
                            </Table.Td>
                            <Table.Td>
                                <Flex align="center" gap="sm">
                                    todo filter
                                    <ActionIcon title="Filter bearbeiten" onClick={() => console.log('edit')} variant="subtle">
                                        <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                    </ActionIcon>
                                </Flex>
                            </Table.Td>
                            <Table.Td>
                                <Flex align="center" gap="sm">
                                    {notification.frequency === 1 ? `Jeden Tag` : `Alle ${notification.frequency}. Tage`}
                                    <ActionIcon title="Häufigkeit bearbeiten" onClick={() => console.log('edit')} variant="subtle">
                                        <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                    </ActionIcon>
                                </Flex>
                            </Table.Td>
                            <Table.Td>
                                <Switch size="sm" checked={notification.active} />
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>

            {/* todo text "Füge weitere benachrichtigungen hinzu indem ...." */}

            {/* todo show delete user button */}
        </Layout>
    );
};

export default Profile;