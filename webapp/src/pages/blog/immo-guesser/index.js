import React from 'react';
import { Container, Title, Text } from '@mantine/core';
import Layout from '@/components/Layout/Layout';
import { useRouter } from 'next/router';
import GhostContentAPI from '@tryghost/content-api';

// Initialisiere die Ghost API
const api = new GhostContentAPI({
  url: process.env.NEXT_PUBLIC_GHOST_API_URL,
  key: process.env.NEXT_PUBLIC_GHOST_API_KEY,
  version: 'v5.0'
});

const ImmoGuesser = () => {
    return (
        <Layout
            title="ImmoGuesser ist nicht mehr verfügbar | Immoradar"
            description="Vielen Dank für dein Interesse an ImmoGuesser. Aufgrund aktueller Entwicklungen haben wir uns entschieden, unsere Immobiliensuche einzustellen. Dadurch können die verfügbaren Daten für Immoguesser nicht mehr aktualisert werden."
            image="https://immoradar.xyz/immo-guesser.jpg"
        >
            <Container py="xl" size="sm">
                <Title order={1} my="xl">ImmoGuesser ist nicht mehr verfügbar</Title>
                <Text mb="md">
                    Vielen Dank für dein Interesse an ImmoGuesser. Aufgrund aktueller Entwicklungen haben wir uns entschieden, unsere Immobiliensuche einzustellen.
                    Dadurch können die verfügbaren Daten für für unser Minispiel ImmoGuesser nicht mehr aktualisert werden.
                </Text>
                <Text mb="md">
                    Solltest du Fragen haben oder Unterstützung benötigen, zögere nicht, uns zu kontaktieren.
                    Wir schätzen dein Verständnis und freuen uns darauf, dir bald wieder helfen zu können.
                </Text>
                <Text>
                    Vielen Dank für dein Vertrauen!<br/>
                    Dein ImmoRadar-Team
                </Text>
            </Container>
        </Layout>
    );
};

export default ImmoGuesser;