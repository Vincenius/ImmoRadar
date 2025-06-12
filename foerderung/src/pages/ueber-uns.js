import React from 'react';
import { Container, Title, Text, Grid, Image, Flex, Box, Divider } from '@mantine/core';
import NextImage from 'next/image';
import Layout from '@/components/Layout/Layout';

const TeamMember = ({ image, name, title, quote }) => {
    return (<Flex gap={{ base: 'md', xs: 'xl' }} direction={{ base: 'column', xs: 'row' }}>
        <Image
            component={NextImage}
            src={`/imgs/team/${image}`}
            height={200}
            width={200}
            h="200px"
            w="200px"
            alt={name}
            radius="xl"
        />

        <Box>
            <Title order={3} size="h4">{name}</Title>
            <Text fs="italic" mb="md">{title}</Text>
            <Text>{quote}</Text>
        </Box>
    </Flex>)
}

const AboutPage = () => {
    return (
        <Layout title="Über Uns">
            <Container py="xl" size="sm">
                <Title order={1} mb="lg">Über uns</Title>
                <Text my="md">
                    Das Team von Förderhaus24 beschäftigt sich mit den wichtigsten Themen rund um Förderungen und Kredite für dein Bau- oder Sanierungsvorhaben.
                </Text>

                <Title order={2} mb="1.5em" mt="2em">Unser Team</Title>
                <Flex gap="3em" direction="column">
                    <TeamMember image="olli.jpg" name="Oliver Rausch" title="Experte für Immobilien & Grundstücke" quote="Wohneigentum ist für viele der Lebenstraum Nummer 1 – und dennoch bleibt er oft unerfüllt. Dabei verschenkt der Staat jedes Jahr Millionen für Kauf und Modernisierung. Ich erlebe es täglich in der Immobilienberatung: Viele wissen schlicht nicht, welche Fördermittel ihnen zustehen. Der Förderreport ändert das. Er macht komplexe Förderung in wenigen Klicks verständlich – und bringt echte finanzielle Erleichterung in greifbare Nähe." />
                    <Divider />
                    <TeamMember image="chris.jpg" name="Christof Scholz" title="Maschinenbauingenieur – Förderungen" quote='Als Ingenieur weiß ich, dass eine gute Lösung immer strukturiert, logisch und effizient ist – genau das leistet unser Förderreport. Besonders in Kombination mit Finanzfragen bietet er Menschen eine realistische Einschätzung: Was ist machbar? Was ist förderfähig? Und wie wird aus einer Idee ein tragfähiges Projekt? Das Ergebnis: "Sicherheit, Planbarkeit – und oft zehntausende Euro mehr Spielraum.“' />
                    <Divider />
                    <TeamMember image="vincent.jpg" name="Vincent Will" title="Webentwickler – UI & UX" quote='Förderung muss nicht kompliziert sein – das war mein Anspruch bei der Entwicklung. Der Förderreport vereint technologische Präzision mit intuitivem Design. In wenigen Klicks erhalten Nutzer:innen eine individuelle Übersicht und konkrete Schritte – ohne Fachjargon, aber mit Tiefgang. "So wird aus einem Bürokratie-Monster ein Werkzeug, das wirklich hilft.“' />
                    <Divider />
                    <TeamMember image="michael.jpg" name="Michael Beuthel" title="Experte für Förderungen" quote='Förderprogramme sind voller Möglichkeiten – und voller Stolperfallen. Ich liebe es, in jedes Detail zu gehen, um das Maximum für ein Projekt herauszuholen. "Wer Förderung clever nutzen will, findet hier den besten Einstieg.' />
                    <Divider />
                    <TeamMember image="sergey.jpg" name="Sergey Sidorov" title="Rechtsberater" quote='Wer Förderung beantragen will, muss oft durch einen Paragrafendschungel – und läuft Gefahr, durch Formfehler oder Fristen wichtige Gelder zu verlieren. Der Förderreport vereinfacht diesen Prozess enorm: Er zeigt, was möglich ist, welche Bedingungen gelten und wo Stolpersteine liegen. So werden nicht nur Chancen sichtbar, sondern Risiken reduziert. “Ein wertvolles Werkzeug mit klarem Nutzen.“' />
                    <Divider />
                    <TeamMember image="felix.jpg" name="Felix Van Huet" title="Bauingenieur – Nachhaltigkeit & Werkstoffe" quote='Nachhaltig zu bauen bedeutet nicht nur ökologisch zu denken – sondern auch wirtschaftlich. Genau hier setzen Förderprogramme an. Doch viele Bauherr:innen scheitern an der Komplexität oder wissen schlicht nicht, was gefördert wird. Der Fördercheck schließt diese Lücke. Er zeigt auf einen Blick, welche Förderungen für energieeffiziente Bauweisen, ökologische Materialien oder smarte Sanierungslösungen bereitstehen. Eine echte Entscheidungshilfe – gerade für zukunftsfähiges Bauen.' />
                </Flex>
            </Container>
        </Layout>
    );
};

export default AboutPage;