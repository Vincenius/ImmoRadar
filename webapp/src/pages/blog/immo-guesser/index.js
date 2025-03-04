import React from 'react';
import { Container, Title, Text } from '@mantine/core';
import Layout from '@/components/Layout/Layout';

const ImmoGuesser = () => {
    return (
        <Layout
            title="ImmoGuesser ist nicht mehr verfügbar | Fertighaus Radar"
            description="Vielen Dank für dein Interesse an ImmoGuesser. Aufgrund aktueller Entwicklungen haben wir uns entschieden, unsere Immobiliensuche einzustellen. Dadurch können die verfügbaren Daten für Immoguesser nicht mehr aktualisert werden."
            image="https://www.fertighausradar.de/immo-guesser.jpg"
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
                    Dein Fertighaus Radar Team
                </Text>
            </Container>
        </Layout>
    );
};

export default ImmoGuesser;