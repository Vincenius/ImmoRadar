import React from 'react';
import { Container, Title, Text, Grid, Image, Flex, Box, Divider } from '@mantine/core';
import NextImage from 'next/image';
import Layout from '@/components/Layout/Layout';
import QuoteSlider from '@/components/QuoteSlider/QuoteSlider';

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
                    Das Team von Förderhaus24 beschäftigt sich mit den wichtigsten Themen rund um Förderungen und Kredite für Dein Bau- oder Sanierungsvorhaben.
                </Text>

                <Title order={2} mb="1.5em" mt="2em">Unser Team</Title>
                <Flex gap="3em" direction="column">
                    <TeamMember image="katja.jpg" name="Katja Wegener" title="Dipl.-Juristin, Expertin für betriebliche Altersversorgung (DVA)" quote='Als Expertin für betriebliche Altersversorgung weiß ich, wie viel Potenzial in staatlich geförderten Lösungen steckt und wie oft dieses Potenzial nicht genutzt wird. Genau deshalb halte ich den Fördercheck für so wertvoll. Er schafft Klarheit, wo sonst Unsicherheit herrscht. Mit dem Förderreport erhalten Menschen in wenigen Minuten einen Überblick, der sonst Tage dauert, und sie erkennen, was ihnen wirklich zusteht.' />
                    <Divider />
                    <TeamMember image="olli.jpg" name="Oliver Rausch" title="Experte für Immobilien & Grundstücke" quote="Wohneigentum ist für viele der Lebenstraum Nummer 1 – und dennoch bleibt dieser oft unerfüllt. Dabei verschenkt der Staat jedes Jahr Millionen für Kauf und Modernisierung. Ich erlebe es täglich in der Immobilienberatung: Viele wissen einfach nicht, welche Fördermittel ihnen zustehen. Der Förderreport ändert das. Er macht komplexe Förderung in wenigen Klicks verständlich – und bringt echte finanzielle Erleichterung in greifbare Nähe." />
                    <Divider />
                    <TeamMember image="chris.jpg" name="Christof Scholz" title="Maschinenbauingenieur – Förderungen" quote='Als Ingenieur weiß ich, dass eine gute Lösung immer strukturiert, logisch und effizient ist. Genau das leistet unser Förderreport. Besonders in Kombination mit Finanzfragen bietet er Menschen eine realistische Einschätzung. Was ist machbar? Was ist förderfähig? Wie wird aus einer Idee ein tragfähiges Projekt? Das Ergebnis: Sicherheit, Planbarkeit und oft Zehntausende Euros mehr Spielraum.' />
                    <Divider />
                    <TeamMember image="vincent.jpg" name="Vincent Will" title="Webentwickler – UI & UX" quote='Förderung muss nicht kompliziert sein, das war mein Anspruch bei der Entwicklung. Der Förderreport vereint technologische Präzision mit innovativem Design. In wenigen Klicks erhalten Nutzer:innen eine individuelle Übersicht und konkrete Schritte – ohne Fachjargon, aber mit Tiefgang. So wird aus einem Bürokratie-Monster ein Werkzeug, welches wirklich hilft.' />
                    <Divider />
                    <TeamMember image="michael.jpg" name="Michael Beuthel" title="Experte für Förderungen" quote='Förderprogramme sind voller Möglichkeiten und voller Stolperfallen. Ich liebe es, detailliert zu arbeiten, um das Maximum für jedes einzelne Projekt herauszuholen. Wer Förderung clever nutzen will, findet hier den besten Einstieg.' />
                    <Divider />
                    <TeamMember image="sergey.jpg" name="Sergey Sidorov" title="Rechtsberater" quote='Wer Förderung beantragen will, muss oft durch einen Paragraphendschungel und läuft Gefahr, durch Formfehler oder Fristen wichtige Gelder zu verlieren. Der Förderreport vereinfacht diesen Prozess enorm. Er zeigt, was möglich ist, welche Bedingungen gelten und wo Stolpersteine liegen. So werden nicht nur Chancen sichtbar, sondern Risiken reduziert. Ein wertvolles Werkzeug mit klarem Nutzen.' />
                    <Divider />
                    <TeamMember image="felix.jpg" name="Felix Van Huet" title="Bauingenieur – Nachhaltigkeit & Werkstoffe" quote='Nachhaltig zu bauen bedeutet nicht nur ökologisch zu denken, sondern auch wirtschaftlich. Genau hier setzen Förderprogramme an. Doch viele Bauherr:innen scheitern an der Komplexität oder wissen schlichtweg nicht, was gefördert wird. Der Förderreport schließt diese Lücke. Er zeigt auf einen Blick, welche Förderungen für energieeffiziente Bauweisen, ökologische Materialien oder smarte Sanierungslösungen bereitstehen. Eine echte Entscheidungshilfe gerade für zukunftsfähiges Bauen.' />
                </Flex>

                <Box my="8em" gap="4em">
                    <Title order={2} mb="md">Das sagen unsere Kunden</Title>
                    <QuoteSlider quotes={[
                        {
                            text: "„Dank dem Förderreport habe ich 20.000,-€ Fördermittel für meine Haussanierung gefunden - das hätte ich sonst nie entdeckt. Einfach zu bedienen, kostenlos und richtig wertvoll!“",
                            author: "– Stefan W., Sanierung"
                        },
                        {
                            text: "„Ich wusste gar nicht, dass es so viele Fördermöglichkeiten gibt! Mit der Premium-Version konnte ich den Antrag schnell und korrekt ausfüllen ohne stundenlang zu recherchieren.“",
                            author: "– Nina M., Neubau"
                        },
                        {
                            text: "„Ich hatte vorher schon recherchiert, aber die Struktur hier hat mir bestimmt zwei Tage Arbeit abgenommen.“",
                            author: "– David P., Sanierung"
                        },
                        {
                            text: "„Ohne den Starter-Check hätten wir das 5.000 ,-€ Zuschussprogramm der Stadt total verpasst. Jetzt ist’s fix beantragt.“",
                            author: "– Sandra K., Sanierung"
                        },
                        {
                            text: "„Wir wollten es selbst in die Hand nehmen – der Förderreport Starter hat uns sofort das richtige Fundament gegeben.“",
                            author: "– Jonas H., Neubau"
                        },
                        {
                            text: "„Durch die Anleitung haben wir 12.400 ,-€ für unseren Neubau erhalten – ohne Berater, einfach Schritt für Schritt umgesetzt.“",
                            author: "– Miriam S., Neubau"
                        },
                    ]} />
                </Box>
            </Container>
        </Layout>
    );
};

export default AboutPage;