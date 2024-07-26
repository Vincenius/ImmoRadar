import { useEffect, useState } from 'react';
import useSWR from 'swr'
import { useRouter } from 'next/router';
import { Title, Table, Skeleton, Switch, ActionIcon, Flex, Badge, NumberInput, Loader, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconTrash, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import Layout from '@/components/Layout/Layout';
import Filter from '@/components/Filter/Filter';
import { fetcher } from '@/utils/fetcher';
import { featureMap } from '@/utils/featureMap';
import { providers as providerMap } from '@/utils/providers';

const formatFilter = ({ minPrice, maxPrice, minSize, maxSize, minRooms, maxRooms, titleIncludes, titleExcludes, features, providers }) => {
    const result = [];

    if ((minPrice || minPrice === 0) && maxPrice) {
        result.push(`${minPrice} - ${maxPrice} €`);
    } else if (minPrice || minPrice === 0) {
        result.push(`Ab ${minPrice} €`);
    } else if (maxPrice) {
        result.push(`Bis ${maxPrice} €`);
    }

    if ((minSize || minSize === 0) && maxSize) {
        result.push(`${minSize} - ${maxSize} m²`);
    } else if (minSize || minSize === 0) {
        result.push(`Ab ${minSize} m²`);
    } else if (maxSize) {
        result.push(`Bis ${maxSize} m²`);
    }

    if ((minRooms || minRooms === 0) && maxRooms) {
        result.push(`${minRooms} - ${maxRooms} Zimmer`);
    } else if (minRooms || minRooms === 0) {
        result.push(`Ab ${minRooms} Zimmer`);
    } else if (maxRooms) {
        result.push(`Bis ${maxRooms} Zimmer`);
    }

    if (titleIncludes) {
        result.push(`Enthält "${titleIncludes}"`);
    }
    if (titleExcludes) {
        result.push(`Enthält nicht "${titleExcludes}"`);
    }

    if (features && features.length) {
        result.push(`Mit ${features.map(f => featureMap[f]).join(', ')}`);
    }
    if (providers && providers.length) {
        result.push(`Ohne ${providers.map(p => providerMap.find(e => e.id === p).label).join(', ')}`);
    }
    
    return result;
    
}

const Profile = () => {
    const router = useRouter();
    const { id } = router.query;
    const [editView, setEditView] = useState([]);
    const [update, setUpdate] = useState('');
    const [updateLoading, setUpdateLoading] = useState();
    const [filterModalOpen, { open: openFilterModal, close: closeFilterModal }] = useDisclosure(false);

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

    const { data = {}, error, isLoading, mutate } = useSWR(`/api/profile?token=${id}`, fetcher)

    const updateNotification = async (key, notificationId, forceUpdate) => {
        setUpdateLoading(key); // todo also include notification id
        let error = false;

        const useUpdate = forceUpdate !== undefined ? forceUpdate : update;
        
        await fetch(`/api/profile?token=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: notificationId, [key]: useUpdate }),
        }).then((res) => ({
            err: !res.ok,
            data: res.json(),
        })).then(({ data, err }) => {
            if (err) {
                error = true;
            } else {
                mutate(data);
                notifications.show({
                    title: 'Benachrichtigung aktualisiert',
                    message: 'Die Benachrichtigung wurde erfolgreich aktualisiert.',
                    color: 'green',
                });
                setEditView(editView.filter(e => e !== key));
                if (key === 'filter') {
                    closeFilterModal()
                }
            }
        }).catch(e => {
            console.error(e);
            error = true;
        }).finally(() => {
            setUpdateLoading(null)
        });

        if (error) {
            notifications.show({
                title: 'Fehlgeschlagen',
                message: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.',
                color: 'red',
            });
        }
    }

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
                        <Table.Th></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {isLoading && Array.from({ length: 5 }).map((_, index) => (
                        <Table.Tr key={`table-loading-${index}`}>
                            <Table.Td><Skeleton height={12} radius="xl" width="80%" my="sm" /></Table.Td>
                            <Table.Td><Skeleton height={12} radius="xl" width="70%" my="sm" /></Table.Td>
                            <Table.Td><Skeleton height={12} radius="xl" width="30%" my="sm" /></Table.Td>
                            <Table.Td><Skeleton height={12} radius="xl" width="40px" my="sm" /></Table.Td>
                            <Table.Td><Skeleton height={12} radius="xl" width="12px" my="sm" /></Table.Td>
                        </Table.Tr>
                    ))}
                    {!isLoading && (data.notifications || []).map((notification, index) => (
                        <Table.Tr key={`table-notification-${index}`}>
                            <Table.Td>
                                <Flex align="center" gap="sm">
                                    {notification.query}
                                </Flex>
                            </Table.Td>
                            <Table.Td>
                                <Flex align="center" columnGap="sm" rowGap={4} wrap="wrap">
                                    {formatFilter(notification.filter).map((f, i) => (
                                        <Badge key={`feature-${index}-${i}`} variant="outline" size="sm" radius="sm" mr="4px">
                                            {f}
                                        </Badge>
                                    )) }
                                    <ActionIcon title="Filter bearbeiten" onClick={openFilterModal} variant="subtle">
                                        <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                    </ActionIcon>
                                    <Modal opened={filterModalOpen} onClose={closeFilterModal} title="Filter">
                                        <Filter
                                            defaultFilter={notification.filter}
                                            applyFilter={(newFilter) => updateNotification('filter', notification.id, newFilter)}
                                            loading={updateLoading === 'filter'}
                                        />
                                    </Modal>
                                </Flex>
                            </Table.Td>
                            <Table.Td>
                                { !editView.includes('frequency') && <Flex align="center" gap="sm">
                                    {notification.frequency === 1 ? `Jeden Tag` : `Alle ${notification.frequency} Tage`}
                                    <ActionIcon title="Häufigkeit bearbeiten" onClick={() => {
                                        setUpdate(notification.frequency);
                                        setEditView([...editView, 'frequency'])
                                    }} variant="subtle">
                                        <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                    </ActionIcon>
                                </Flex> }
                                { editView.includes('frequency') && <Flex align="center" gap="sm">
                                    <NumberInput
                                        min={1}
                                        max={30}
                                        placeholder="(alle x Tage)"
                                        w={130}
                                        value={update}
                                        onChange={val => setUpdate(val)}
                                    />
                                    <ActionIcon
                                        loading={updateLoading === 'frequency'}
                                        title="Häufigkeit bearbeiten"
                                        onClick={() => updateNotification('frequency', notification.id)}
                                        variant="outline"
                                        color="green"
                                    >
                                        <IconCheck style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                    </ActionIcon>
                                </Flex> }
                            </Table.Td>
                            <Table.Td>
                                <Flex gap="sm">
                                    <Switch
                                        size="sm"
                                        checked={notification.active}
                                        onChange={() => updateNotification('active', notification.id, !notification.active)}
                                        disabled={updateLoading === 'active'}
                                        mr={updateLoading === 'active' ? 0 : 26}
                                    />
                                    { updateLoading === 'active' && <Loader size={14} /> }
                                </Flex>
                            </Table.Td>
                            <Table.Td align='right'>
                                <ActionIcon title="Löschen" onClick={() => console.log('todo delete')} variant="outline" color="red">
                                    <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                </ActionIcon>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>

            {/* todo text "Füge weitere benachrichtigungen hinzu indem ...." */}

            {/* todo change email input */}

            {/* todo show delete user button */}
        </Layout>
    );
};

export default Profile;