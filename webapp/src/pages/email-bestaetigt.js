import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Title, Text } from '@mantine/core';

const EmailBestaetigt = () => {
    return (
        <Layout title="E-Mail bestätigt | ImmoRadar" description="E-Mail Addresse wurde erfolgreich bestätigt.">
            <Title order={1} my="xl">E-Mail Adresse erfolgreich bestätigt!</Title>
            <Text>Vielen Dank, Ihre E-Mail-Adresse wurde erfolgreich bestätigt.</Text>
        </Layout>
    );
};

export default EmailBestaetigt;