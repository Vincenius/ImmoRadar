import React from 'react';
import { Container, Title, Text, Flex } from '@mantine/core';
import Layout from '@/components/Layout/Layout';
import { cities } from './cities';

const ImmoGuesser = () => {
    return (
        <Layout
          title="ImmoGuesser | Schätze die Miete der Wohnungen"
          description="Teste dein Gespür für Mietpreise! In diesem kleinen Spiel bekommst du fünf verschiedene Wohnungen angezeigt. Deine Aufgabe: Schätze, wie viel die Wohnung kostet."
          image="https://immoradar.xyz/immo-guesser.jpg"
        >
            <Container py="xl" size="sm">
                <Title mb="sm" order={1}>ImmoGuesser</Title>
                <Text mb="md">Teste dein Gespür für Mietpreise! In diesem kleinen Spiel bekommst du fünf verschiedene Wohnungen angezeigt. Deine Aufgabe: Schätze, wie viel die Wohnung kostet.</Text>
                <Title mb="md" order={2}>Wähle deine Region:</Title>
                { cities.map((city) => <Title order={3} key={city} mb="xs">{city}</Title>) }
            </Container>
        </Layout>
    );
};

export default ImmoGuesser;