import React from 'react';
import { Container, Title, Text, Grid, Image } from '@mantine/core';
import NextImage from 'next/image';
import Layout from '@/components/Layout/Layout';

const TeamMember = ({ image, name, title }) => {
    return (<>
        <Image
            component={NextImage}
            src={`/imgs/team/${image}`}
            height={200}
            width={200}
            h="auto"
            alt={name}
            radius="xl"
            mb="sm"
        />
        <Title order={3} size="h4">{name}</Title>
        <Text fs="italic">{title}</Text>
    </>)
}

const AboutPage = () => {
    return (
        <Layout
            title="Über Uns | ImmoRadar"
            // TODO description="Willkommen bei ImmoRadar, Ihrer Webseite für die Wohnungssuche in Deutschland. Diese Webseite wurde von mir, Vincent, ins Leben gerufen. Mein Ziel ist es, die Wohnungssuche so einfach und stressfrei wie möglich zu gestalten..."
        >
            <Container py="xl" size="sm">
                <Title order={1} mb="lg">Über uns</Title>
                <Text my="md">
                    <b>Einfach Finden.</b> Das Team von ImmoRadar beschäftigt sich mit den wichtigsten Themen rund um Dein persönliches Traumhaus.
                </Text>

                <Title order={2} mb="lg" mt="xl">Unser Team</Title>
                <Grid mb="3rem">
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <TeamMember image="olli.jpg" name="Oliver Rausch" title="Experte für Immobilien & Grundstücke"/>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <TeamMember image="felix.jpg" name="Felix Van Huet" title="Bauingenieur - Nachhaltigkeit & Werkstoffe"/>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <TeamMember image="chris.jpg" name="Christof Scholz" title="Maschinenbauingenieur - Förderungen & Vertragsgestaltung"/>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <TeamMember image="vincent.jpg" name="Vincent Will" title="Webentwickler - UI & UX"/>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <TeamMember image="michael.jpg" name="Michael Beuthel" title="Experte für Förderungen"/>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <TeamMember image="sergey.jpg" name="Sergey Sidorov" title="Rechtsberater"/>
                    </Grid.Col>
                </Grid>

                <Title order={2} mb="lg">Kontakt</Title>
                <Text my="md">
                    <a href="mailto:oliver.rausch@immoradar.xyz">oliver.rausch@immoradar.xyz</a><br/>
                    <a href="mailto:vincent@immoradar.xyz">vincent@immoradar.xyz</a><br/>
                </Text>
            </Container>
        </Layout>
    );
};

export default AboutPage;