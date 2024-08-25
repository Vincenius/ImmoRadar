import React from 'react';
import { Container, Title, Text } from '@mantine/core';
import Layout from '@/components/Layout/Layout';

const AboutPage = () => {
    return (
        <Layout
            title="Über Uns | ImmoRadar"
            description="Willkommen bei ImmoRadar, Ihrer Webseite für die Wohnungssuche in Deutschland. Diese Webseite wurde von mir, Vincent, ins Leben gerufen. Mein Ziel ist es, die Wohnungssuche so einfach und stressfrei wie möglich zu gestalten..."
        >
            <Container py="xl" size="sm">
                <Title order={1}>Über uns</Title>
                <Text my="md">
                    Willkommen bei ImmoRadar, Ihrer Webseite für die Wohnungssuche in Deutschland.
                    Diese Webseite wurde von mir, <a href="https://vincentwill.com" target="_blank">Vincent</a>, ins Leben gerufen. Mein Ziel ist es, die Wohnungssuche so einfach und stressfrei wie möglich zu gestalten.
                </Text>
                <Text my="md">
                    Die Idee zu ImmoRadar entstand aus meiner eigenen Erfahrung mit der oft mühsamen Suche nach einer Wohnung in Berlin.
                    Ich wollte eine Suchmaschine schaffen, die es mir ermöglicht, alle verfügbaren Wohnungen von verschiedenen Immobilien Webseiten auf einen Blick zu sehen.
                </Text>
                <Text my="md">
                    ImmoRadar befindet sich aktuell noch in der Beta-Phase. Ich arbeite ständig daran, die Webseite zu verbessern und neue Funktionen hinzuzufügen.
                    Wenn Sie Fragen oder Anregungen haben, zögern Sie nicht, mich zu kontaktieren.
                </Text>
                <Text my="md">
                    <a href="mailto:vincent@immoradar.xyz">vincent@immoradar.xyz</a>
                </Text>
            </Container>
        </Layout>
    );
};

export default AboutPage;