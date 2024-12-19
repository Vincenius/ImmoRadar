import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Title, Text } from '@mantine/core';

const EmailBestaetigt = () => {
    return (
        <Layout title="Unerwarteter Fehler | ImmoRadar" description="E-Mail Addresse wurde erfolgreich bestätigt.">
            <Title order={1} my="xl">Oops, da ist etwas schiefgelaufen!</Title>
            <Text mb="sm">Es tut uns leid, aber ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es in ein paar Minuten erneut oder kontaktieren Sie unseren Support, falls das Problem weiterhin besteht.</Text>
            <Text>Kontakt: <a href="mailto:vincent@immoradar.xyz">vincent@immoradar.xyz</a></Text>
        </Layout>
    );
};

export default EmailBestaetigt;