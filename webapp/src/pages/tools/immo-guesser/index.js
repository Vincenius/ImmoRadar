import React from 'react';
import { Container, Title, Text } from '@mantine/core';
import Layout from '@/components/Layout/Layout';

const AboutPage = () => {
    return (
        <Layout
          title="ImmoGuesser | Schätze die Miete der Wohnungen"
          description="Teste dein Gespür für Mietpreise! In diesem kleinen Spiel bekommst du fünf verschiedene Wohnungen angezeigt. Deine Aufgabe: Schätze, wie viel die Wohnung kostet."
          image="https://immoradar.xyz/immo-guesser.jpg"
        >
            <Container py="xl" size="sm">
                TODO overview von städten
            </Container>
        </Layout>
    );
};

export default AboutPage;