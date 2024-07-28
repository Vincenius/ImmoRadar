import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Title, Text } from '@mantine/core';

const Imprint = () => {
    return (
        <Layout>
            <Title order={1} py="xl">Account erfolgreich gelöscht</Title>
            <Text fs="italic">Dein Account wurde mit allen dazugehörigen Benachrichtigungen entfernt.</Text>
        </Layout>
    );
};

export default Imprint;