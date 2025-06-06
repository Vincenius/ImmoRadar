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
        <Layout title="Über Uns">
            <Container py="xl" size="sm">
                <Title order={1} mb="lg">Über uns</Title>
                <Text my="md">
                    Das Team von Förderhaus24 beschäftigt sich mit den wichtigsten Themen rund um Förderungen und Kredite für dein Bau- oder Sanierungsvorhaben.
                </Text>

                <Title order={2} mb="lg" mt="xl">Unser Team</Title>
                <Grid mb="3rem">
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <TeamMember image="olli.jpg" name="Oliver Rausch" title="Experte für Immobilien & Grundstücke" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <TeamMember image="felix.jpg" name="Felix Van Huet" title="Experte für Förderungen" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <TeamMember image="chris.jpg" name="Christof Scholz" title="Experte für Förderungen" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <TeamMember image="michael.jpg" name="Michael Beuthel" title="Experte für Förderungen" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <TeamMember image="sergey.jpg" name="Sergey Sidorov" title="Experte für Förderungen" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <TeamMember image="vincent.jpg" name="Vincent Will" title="Webentwickler" />
                    </Grid.Col>
                </Grid>
                <Title order={2} mb="lg">Kontakt</Title>
                <Text my="md">
                    <a href="mailto:support@foerderhaus24.de">support@foerderhaus24.de</a>
                </Text>
            </Container>
        </Layout>
    );
};

export default AboutPage;